import { Schema, model } from 'mongoose';
import { GraphQLError } from 'graphql';

const ProfileSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  city: String,
  province: String,
  country: String,
});

const ProfileModel = model('Profile', ProfileSchema);

const UnauthorizedError = new GraphQLError('Unauthorized', {
  extensions: {
    code: 'UNAUTHORIZED',
    http: { status: 401 }
  }
});

export default {
  Query: {
    getProfile: async (parent, args, contextValue) => {
      if (!contextValue.user) return UnauthorizedError;
      const { userId } = contextValue.user;
      return await ProfileModel.findOne({ userId });
    },
  },

  Mutation: {
    updateProfile: async (parent, args, contextValue) => {
      if (!contextValue.user) return UnauthorizedError;
      const { userId } = contextValue.user;
      const { firstName, lastName, city, province, country } = args;

      const profile = await ProfileModel.findOneAndUpdate(
        { userId },
        { $set: { firstName, lastName, city, province, country } },
        { new: true, upsert: true }
      );
      return profile;
    },
  }
};
