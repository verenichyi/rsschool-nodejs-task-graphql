import { GraphQLList, GraphQLNonNull } from 'graphql';

import { Context, idField } from '../types/common.js';
import { PostType } from '../types/posts.js';

export const PostQueries = {
  post: {
    type: PostType,
    args: {
      ...idField,
    },
    resolve: async (_: unknown, { id }: { id: string }, { db }: Context) => {
      return await db.post.findUnique({ where: { id } });
    },
  },
  posts: {
    type: new GraphQLNonNull(new GraphQLList(PostType)),
    resolve: async (_: unknown, __: unknown, { db }: Context) => {
      return await db.post.findMany();
    },
  },
};
