const messageResolvers = require("./messageResolvers.js");
const userResolvers = require("./userResolvers.js");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
