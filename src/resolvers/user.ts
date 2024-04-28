import { Schema, model } from 'mongoose';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const jwtSecret: string = process.env.JWT_SECRET || 'mysecret';
const jwtExpiry: string = process.env.JWT_EXPIRY || '12h';
const issuer: string = process.env.JWT_ISSUER || 'zhongyi';

const UsersSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  salt: String,
});

const UsersModel = model('Users', UsersSchema);

function getToken(email: string, _id: string): string {
  return jwt.sign({ iss: issuer, email, userId: _id }, jwtSecret, { expiresIn: jwtExpiry });
}

export default {
  Query: {
    login: async (parent, args) => {
      const { email, password } = args;

      const user = await UsersModel.findOne({ email });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: '404' },
        });
      }

      const hashedPassword = crypto
        .pbkdf2Sync(password, user.salt, 310000, 32, 'sha256')
        .toString('hex');

      if (user.password !== hashedPassword) {
        throw new GraphQLError('Invalid password', {
          extensions: { code: '400' },
        });
      }

      return {
        token: getToken(user.email, user._id.toString()),
      };
    },
  },

  Mutation: {
    register: async (parent, args) => {
      const { email, password } = args;
      // check if user exists
      const user = await UsersModel.findOne({ email });

      if (user) {
        throw new GraphQLError('User already exist', {
          extensions: { code: '409' },
        });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 310000, 32, 'sha256')
        .toString('hex');

      const newUser = new UsersModel({
        email,
        password: hashedPassword,
        salt,
      });

      const savedUser = await newUser.save();

      return {
        token: getToken(savedUser.email, savedUser._id.toString()),
      };
    },
  },
};
