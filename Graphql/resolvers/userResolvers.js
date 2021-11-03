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
        const errors = [];
        const { valid, errors: validErrors } = validateRegisterInput(
          username,
          password,
          confirmPassword
        );

        if (!valid) {
          errors.push({ message: Object.values(validErrors)[0] });

          return {
            errors,
          };
        }

        const checkUserExist = await User.findOne({
          where: { username },
        });

        if (checkUserExist) {
          errors.message = "this name is taken";
          return {
            errors,
          };
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
          user: {
            ...loginUser.dataValues,
            token,
          },
          errors,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async loginUser(_, { username, password }) {
      try {
        const errors = [];

        const { valid, errors: validErrors } = validateLoginInput(
          username,
          password
        );

        if (!valid) {
          errors.push(validErrors);
          return {
            errors,
          };
        }

        const loginUser = await User.findOne({ where: { username } });

        if (!loginUser) {
          errors.push({ message: "user not found" });
          return {
            errors,
          };
        }

        const match = await argon2.verify(loginUser.password, password);

        if (!match) {
          errors.push({ message: "Check your username or password" });

          return {
            errors,
          };
        }

        const token = generateUserToken(loginUser);

        return {
          user: {
            ...loginUser.dataValues,
            token,
          },
          errors,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
