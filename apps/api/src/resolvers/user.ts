import { Context } from '../context';

export const userResolvers = {
  Query: {
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
    snippets: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.snippet.findMany({
        where: { authorId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
};