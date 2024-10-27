import { PrismaClient } from '@prisma/client';
import { initMemberTypesLoader } from './member-types/loaders.js';

export function initDataLoaders(db: PrismaClient) {
  return {
    memberTypesLoader: initMemberTypesLoader(db),
  };
}

export type DataLoaders = ReturnType<typeof initDataLoaders>;
