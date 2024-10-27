import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { initDataLoaders } from './loaders.js';

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
