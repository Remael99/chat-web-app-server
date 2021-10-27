const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const SECRET = require("./config.js");

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    const authHeader = context.req.headers.authorization;
    token = authHeader.split("Bearer ")[1];
  } else {
    throw new Error("Authorization header must be provided");
  }

  if (token) {
    try {
      const user = jwt.verify(token, SECRET);
      context.user = user;
    } catch (err) {
      throw new AuthenticationError("invalid / expired token");
    }
  } else {
    throw new Error("Authentication token must be 'Bearer [token] ");
  }

  return context;
};
