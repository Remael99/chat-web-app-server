const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: Int!
    username: String!
    createdAt: String!
    token: String!
  }

  type Message {
    id: Int!
    content: String!
    to: String!
    from: String!
    createdAt: String!
  }

  type Query {
    getMessages: [Message]!
    getUsers: [User]!
    getUser(username: String!): User!
    getUserMessages(usernameFrom: String!): [Message]!
  }

  type Mutation {
    createMessage(content: String!, to: String!): Message!
    registerUser(
      username: String!
      password: String!
      confirmPassword: String!
    ): User!
    loginUser(username: String!, password: String!): User!
  }
`;
