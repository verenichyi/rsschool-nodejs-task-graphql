import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { initDataLoaders } from './loaders.js';
import { GraphQLObjectType, GraphQLSchema } from 'graphql/index.js';
import { MemberTypesQueries } from './member-types/queries.js';
import { UserQueries } from './users/queries.js';
import { UserMutations } from './users/mutations.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    handler: async function (request) {
      const { query, variables } = request.body;

      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: {
            ...MemberTypesQueries,
            ...UserQueries,
          },
        }),
        mutation: new GraphQLObjectType({
          name: 'Mutation',
          fields: {
            ...UserMutations,
          },
        }),
      });

      const depthErrors = validate(schema, parse(String(query)), [depthLimit(5)]);

      if (depthErrors.length) {
        return {
          errors: depthErrors,
        };
      }

      return await graphql({
        schema,
        source: String(query),
        variableValues: variables,
        contextValue: { db: prisma, loaders: initDataLoaders(prisma) },
      });
    },
  });
};

export default plugin;
