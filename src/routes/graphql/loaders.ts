import { PrismaClient } from '@prisma/client';
import { initMemberTypesLoader } from './member-types/loaders.js';
import {
  initSubscriptionsToUsersLoader,
  initUsersSubscriptionsLoader,
} from './users/loaders.js';
import { initPostsLoader } from "./posts/loaders.js";

export function initDataLoaders(db: PrismaClient) {
  return {
    memberTypesLoader: initMemberTypesLoader(db),
    subscriptionsToUsersLoader: initSubscriptionsToUsersLoader(db),
    usersSubscriptionsLoader: initUsersSubscriptionsLoader(db),
    postsLoader: initPostsLoader(db),
  };
}

export type DataLoaders = ReturnType<typeof initDataLoaders>;
