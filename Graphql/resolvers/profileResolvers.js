const { Profile } = require("../../models/index.js");
const checkAuth = require("../../utils/check-auth");
const { validateEmail } = require("../../utils/validators.js");

module.exports = {
  Query: {
    async getProfile(_, { id }, context) {
      try {
        checkAuth(context);
        const errors = [];

        const profile = await Profile.findOne({ where: { id } });

        if (!profile) {
          errors.push({ message: "no profile found" });
          return errors;
        }

        return {
          profile: {
            ...profile.dataValues,
          },
          errors,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createProfile(_, { profileInput }, context) {
      try {
        const user = checkAuth(context).user;
        const errors = [];

        console.log(user.id);

        const { errors: validationErrors, valid } = validateEmail(
          profileInput.email
        );

        if (!valid) {
          errors.push({ message: Object.values(validationErrors)[0] });
          return { errors };
        }

        const profile = await Profile.findOne({ where: { id: user.id } });

        if (profile && profile.Profile_Login_id === user.id) {
          errors.push({
            message: "you already have a profile",
          });
          return { errors };
        }

        if (profile && profile.email === profileInput.email) {
          errors.push({
            message: "profile already exists would you like to update",
          });

          return { errors };
        }

        const Profile_Login_id = user.id;

        const newProfile = await Profile.create({
          ...profileInput,
          Profile_Login_id,
        });

        await newProfile.save();

        return {
          profile: {
            ...newProfile.dataValues,
          },
          errors,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
