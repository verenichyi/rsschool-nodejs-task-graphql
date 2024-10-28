import { GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/common.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { memberTypesIdField, MemberTypeType } from '../types/member-type.js';

export const MemberTypesQueries = {
  memberType: {
    type: MemberTypeType,
    args: {
      ...memberTypesIdField,
    },
    resolve: async (parent: unknown, { id }: { id: MemberTypeId }, { db }: Context) => {
      return await db.memberType.findUnique({ where: { id } });
    },
  },
  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(MemberTypeType)),
    resolve: async (parent: unknown, args: unknown, { db }: Context) => {
      return await db.memberType.findMany();
    },
  },
};
