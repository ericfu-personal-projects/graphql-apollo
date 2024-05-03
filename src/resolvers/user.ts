import { Schema, model } from 'mongoose';
import CustomErrors from '../errors/custom.js';
import { getToken, getHashedPassword, getSalt } from '../utils/jwtUtil.js';

const UsersSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  salt: String,
});

const UsersModel = model('Users', UsersSchema);

export default {
  Query: {
    login: async (parent, args) => {
      const { email, password } = args;

      try {
        // check if user exists
        const user = await UsersModel.findOne({ email });

        if (!user) {
          return CustomErrors.INVALID_CREDENTIALS;
        }
  
        // validate password
        const hashedPassword = getHashedPassword(password, user.salt);
  
        if (user.password !== hashedPassword) {
          return CustomErrors.INVALID_CREDENTIALS;
        }
  
        // generate token
        return {
          token: getToken(user.email, user._id.toString()),
        };
      } catch (error) {
        console.error(error);
        return CustomErrors.INTERNAL_ERROR;
      }
    },
  },

  Mutation: {
    register: async (parent, args) => {
      const { email, password } = args;

      try {
        // check if user exists
        const user = await UsersModel.findOne({ email });

        if (user) {
          return CustomErrors.DUPLICATED_USER;
        }

        // hash password
        const salt = getSalt();

        // create new user
        const newUser = new UsersModel({
          email,
          password: getHashedPassword(password, salt),
          salt,
        });

        const savedUser = await newUser.save();

        return {
          token: getToken(savedUser.email, savedUser._id.toString()),
        };
      } catch (error) {
        console.error(error);
        return CustomErrors.INTERNAL_ERROR;
      }
    },
  },
};
