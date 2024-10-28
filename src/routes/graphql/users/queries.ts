import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql';

import { SubscriptionToUser, UserSubscription, UserType } from '../types/users.js';
import { Context, idField } from '../types/common.js';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const UserQueries = {
  user: {
    type: UserType,
    args: {
      ...idField,
    },
    resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
      return await db.user.findUnique({ where: { id } });
    },
  },
  users: {
    type: new GraphQLNonNull(new GraphQLList(UserType)),
    resolve: async (
      _: unknown,
      { id }: { id: string },
      { db, loaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parseResolveInfo(info) as ResolveTree,
        UserType,
      );

      const subscribedToUser = 'subscribedToUser' in fields;
      const userSubscribedTo = 'userSubscribedTo' in fields;

      const users = await db.user.findMany({
        include: {
          subscribedToUser,
          userSubscribedTo,
        },
      });

      return users;
    },
  },
};
