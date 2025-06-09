import { Context } from '../context/context';

export const userResolvers = {
  Query: {
    /**
     * Get the currently authenticated user.
     * Throws if not authenticated.
     */
    me: async (_: any, __: any, { prisma, userId }: Context) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      return prisma.user.findUnique({
        where: { id: userId },
      });
    },
  },

  User: {
    /**
     * Get all snippets authored by this user, newest first.
     */
    snippets: async (parent: any, _args: any, { prisma }: Context) => {
      return prisma.snippet.findMany({
        where: { authorId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
};