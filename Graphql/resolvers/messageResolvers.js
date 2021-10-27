const { UserInputError } = require("apollo-server-errors");
const { Message, User } = require("../../models/index.js");
const checkAuth = require("../../utils/check-auth");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    async getMessages(_, args, context) {
      try {
        checkAuth(context);
        const messages = await Message.findAll();

        return messages;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUserMessages(_, { usernameFrom }, context) {
      try {
        const userLoggedIn = checkAuth(context).user;

        const findUser = await User.findOne({
          where: { username: userLoggedIn.username },
        });

        if (findUser.username === usernameFrom) {
          throw new Error("no messages to you from you dummy!!");
        }

        let messages = await Message.findAll();

        const userMessages = [];

        messages.forEach((message) => {
          if (
            (message.dataValues.to === findUser.username &&
              message.dataValues.from === usernameFrom) ||
            (message.dataValues.to === usernameFrom &&
              message.dataValues.from === findUser.username)
          ) {
            userMessages.push(message.dataValues);
          }
        });

        return userMessages;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createMessage(_, { content, to }, context) {
      try {
        const userLoggedIn = checkAuth(context).user;
        console.log(userLoggedIn);

        const findUser = await User.findOne({
          where: { username: to },
        });

        if (!findUser) {
          throw new UserInputError("user not found", {
            noUser: "no such user",
          });
        }

        if (findUser.username === userLoggedIn.username) {
          throw new UserInputError("not alowed", {
            notAllowed: "cannot send messages to self",
          });
        }

        const from = userLoggedIn.username;
        console.log(from);
        const createdAt = new Date().toISOString();

        const newMessage = await Message.create({
          content,
          to,
          from,
          createdAt,
        });

        await newMessage.save();

        return {
          ...newMessage.dataValues,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
