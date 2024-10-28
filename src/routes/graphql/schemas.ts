import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberTypesQueries } from './member-types/queries.js';
import { memberTypesIdField, MemberTypeType } from './types/member-type.js';
import { MemberTypeId } from '../member-types/schemas.js';
import { Context } from './types/common.js';
import { UserQueries } from "./users/queries.js";
import { UserMutations } from "./users/mutations.js";

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const schema = new GraphQLSchema({
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
      ...UserMutations
    },
  }),
});
