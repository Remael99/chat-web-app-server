const { gql } = require("apollo-server-express");

module.exports = gql`
  type Error {
    message: String!
  }

  type User {
    id: Int!
    username: String!
    createdAt: String!
    token: String!
  }

  type UserResponse {
    user: User
    errors: [Error]
  }

  type Message {
    id: Int!
    content: String!
    to: String!
    from: String!
    createdAt: String!
  }

  type Profile {
    id: Int!
    email: String!
    status: String!
    profilePic: String!
    createdAt: String!
  }

  input ProfileInput {
    email: String
    status: String!
    profilePic: String!
  }

  type ProfileResponse {
    profile: Profile
    errors: [Error]
  }

  type MessageResponse {
    message: Message
    errors: [Error]
  }

  type Query {
    getMessages: [Message]!
    getUsers: [User]!
    getUser(username: String!): User!
    getUserMessages(usernameFrom: String!): [Message]!
    getProfile(id: Int!): ProfileResponse!
  }

  type Mutation {
    createMessage(content: String!, to: String!): MessageResponse!
    registerUser(
      username: String!
      password: String!
      confirmPassword: String!
    ): UserResponse!
    loginUser(username: String!, password: String!): UserResponse!
    createProfile(profileInput: ProfileInput): ProfileResponse!
  }

  type Subscription {
    messageCreated(username: String!): Message!
  }
`;
