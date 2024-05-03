import { Schema, model } from 'mongoose';
import CustomErrors from '../errors/custom.js';

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

export default {
  Query: {
    getProfile: async (parent, args, contextValue) => {
      if (!contextValue.user) return CustomErrors.UNAUTHORIZED;

      try {
        const { userId } = contextValue.user;
        return await ProfileModel.findOne({ userId });
      } catch (error) {
        console.error(error);
        return CustomErrors.INTERNAL_ERROR;
      }
    },
  },

  Mutation: {
    updateProfile: async (parent, args, contextValue) => {
      if (!contextValue.user) return CustomErrors.UNAUTHORIZED;

      const { userId } = contextValue.user;

      try {
        const profile = await ProfileModel.findOneAndUpdate(
          { userId },
          { $set: args },
          { new: true, upsert: true },
        );
        return profile;
      } catch (error) {
        console.error(error);
        return CustomErrors.INTERNAL_ERROR;
      }
    },
  },
};
