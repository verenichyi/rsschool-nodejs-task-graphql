import { GraphQLList, GraphQLNonNull } from 'graphql';

import { Context, idField } from '../types/common.js';
import { ProfileType } from '../types/profiles.js';

export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: {
      ...idField,
    },
    resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
      return await db.profile.findUnique({ where: { id } });
    },
  },
  profiles: {
    type: new GraphQLNonNull(new GraphQLList(ProfileType)),
    resolve: async (_: unknown, __: unknown, { db }: Context) => {
      return await db.profile.findMany();
    },
  },
};
