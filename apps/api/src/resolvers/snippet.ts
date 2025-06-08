import { Context } from '../context';
import { sendSnippetApprovedEmail, sendSnippetRejectedEmail } from '../utils/email';

export const snippetResolvers = {
  Query: {
    snippets: async (_: any, __: any, { prisma }: Context) => {
      return prisma.snippet.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      });
    },

    snippet: async (_: any, { id }: any, { prisma }: Context) => {
      const snippet = await prisma.snippet.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!snippet || snippet.status !== 'APPROVED') {
        throw new Error('Snippet not found');
      }

      return snippet;
    },

    mySnippets: async (_: any, __: any, { prisma, userId }: Context) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }

      return prisma.snippet.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      });
    },

    allSnippets: async (_: any, __: any, { prisma, userRole }: Context) => {
      if (userRole !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      return prisma.snippet.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      });
    },

    pendingSnippets: async (_: any, __: any, { prisma, userRole }: Context) => {
      if (userRole !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      return prisma.snippet.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      });
    },
  },

  Mutation: {
    createSnippet: async (_: any, { input }: any, { prisma, userId }: Context) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }

      return prisma.snippet.create({
        data: {
          ...input,
          authorId: userId,
        },
        include: { author: true },
      });
    },

    updateSnippet: async (_: any, { id, input }: any, { prisma, userId }: Context) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const snippet = await prisma.snippet.findUnique({
        where: { id },
      });

      if (!snippet || snippet.authorId !== userId) {
        throw new Error('Snippet not found or not authorized');
      }

      return prisma.snippet.update({
        where: { id },
        data: input,
        include: { author: true },
      });
    },

    deleteSnippet: async (_: any, { id }: any, { prisma, userId }: Context) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const snippet = await prisma.snippet.findUnique({
        where: { id },
      });

      if (!snippet || snippet.authorId !== userId) {
        throw new Error('Snippet not found or not authorized');
      }

      await prisma.snippet.delete({
        where: { id },
      });

      return true;
    },

    approveSnippet: async (_: any, { id }: any, { prisma, userRole }: Context) => {
      if (userRole !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const snippet = await prisma.snippet.update({
        where: { id },
        data: { status: 'APPROVED' },
        include: { author: true },
      });

      // Send approval email (don't await to not block the response)
      sendSnippetApprovedEmail(
        snippet.author.email,
        snippet.author.email.split('@')[0],
        snippet.title,
        snippet.id
      ).catch(console.error);

      return snippet;
    },

    rejectSnippet: async (_: any, { id, reason }: any, { prisma, userRole }: Context) => {
      if (userRole !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const snippet = await prisma.snippet.update({
        where: { id },
        data: { status: 'REJECTED' },
        include: { author: true },
      });

      // Send rejection email (don't await to not block the response)
      sendSnippetRejectedEmail(
        snippet.author.email,
        snippet.author.email.split('@')[0],
        snippet.title,
        reason
      ).catch(console.error);

      return snippet;
    },
  },

  Snippet: {
    author: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};