const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const typeDefs = require("./Graphql/typedefs.js");
const resolvers = require("./Graphql/resolvers/index.js");
const { sequelize } = require("./models");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: (context) => context,
  });

  const subscriptionServer = new SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
      async onConnect(connectionParams, webSocket, context) {
        console.log(connectionParams);
      },
    },
    {
      server: httpServer,
      path: "/",
    }
  );

  await server.start();

  server.applyMiddleware({
    app,
    path: "/",
  });

  sequelize
    .authenticate()
    .then(() => console.log("and database connected"))
    .catch((error) => console.log(error));

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(` Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
