const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const typeDefs = require("./Graphql/typedefs.js");
const resolvers = require("./Graphql/resolvers/index.js");
const { sequelize } = require("./models");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");

startApolloServer(typeDefs, resolvers);

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const subscriptionServer = new SubscriptionServer.create(
    { typeDefs, resolvers, execute, subscribe },
    {
      server: httpServer,
      path: "/",
    }
  );

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
