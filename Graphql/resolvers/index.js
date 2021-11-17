const messageResolvers = require("./messageResolvers.js");
const profileResolvers = require("./profileResolvers.js");
const userResolvers = require("./userResolvers.js");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
    ...profileResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
