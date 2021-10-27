const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators.js");
const { User } = require("../../models/index.js");
const SECRET = require("../../utils/config.js");
const argon2 = require("argon2");
const checkAuth = require("../../utils/check-auth.js");

const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = {
  Query: {
    async getUsers(_, args, context) {
      try {
        checkAuth(context);
        const users = await User.findAll();

        return users;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUser(_, { username }, context) {
      try {
        checkAuth(context);
        const user = await User.findOne({ where: { username } });

        return {
          ...user.dataValues,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async registerUser(_, { username, password, confirmPassword }) {
      try {
        const { valid, errors } = validateRegisterInput(
          username,
          password,
          confirmPassword
        );

        if (!valid) {
          throw new UserInputError("errors", { errors });
        }

        const checkUserExist = await User.findOne({
          where: { username },
        });

        if (checkUserExist) {
          errors.general = "this name is taken";
          throw new UserInputError("username is taken", { errors });
        }

        password = await argon2.hash(password, 12);

        const createdAt = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        const loginUser = await User.create({
          username,
          password,
          createdAt,
          updatedAt,
        });

        const res = await loginUser.save();

        const token = generateUserToken(res);

        return {
          ...res.dataValues,
          token,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async loginUser(_, { username, password }) {
      try {
        const { valid, errors } = validateLoginInput(username, password);

        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }

        const loginUser = await User.findOne({ where: { username } });

        if (!loginUser) {
          errors.general = "user not found";

          throw new UserInputError("user not found", { errors });
        }

        const match = await argon2.verify(loginUser.password, password);

        if (!match) {
          errors.general = "Check your username or password";
          throw new UserInputError("Wrong credentials", { errors });
        }

        const token = generateUserToken(loginUser);

        return {
          ...loginUser.dataValues,
          token,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
