import { userResolvers } from './user';
import { snippetResolvers } from './snippet';
import { authResolvers } from './auth';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...snippetResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...snippetResolvers.Mutation,
  },
  User: userResolvers.User,
  Snippet: snippetResolvers.Snippet,
};