import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
      const query = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => {
          return {};
        },
      });

      const mutation = new GraphQLObjectType({
        name: 'Query',
        fields: () => {
          return {};
        },
      });

      const schema = new GraphQLSchema({ query, mutation });

      const depthErrors = validate(schema, parse(String(request.body.query)), [
        depthLimit(5),
      ]);

      if (depthErrors.length) {
        return {
          errors: depthErrors,
        };
      }

      return await graphql({
        schema,
        source: String(request.body.query),
        contextValue: fastify,
        variableValues: request.body.variables,
      });
    },
  });
};

export default plugin;
