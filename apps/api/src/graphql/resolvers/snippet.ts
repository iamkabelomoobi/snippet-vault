import { Context } from "../context/context";
import {
  sendSnippetApprovedEmail,
  sendSnippetRejectedEmail,
} from "../../utils/email";

/**
 * GraphQL resolvers for Snippet operations.
 * Includes queries for public, user, and admin access, as well as mutations for CRUD and moderation.
 */
export const snippetResolvers = {
  Query: {
    /**
     * Get all approved snippets (public).
     */
    snippets: async (_: any, __: any, { prisma }: Context) => {
      return prisma.snippet.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      });
    },

    /**
     * Get a single snippet by ID.
     * - Public if APPROVED
     * - Author or admin can view any status
     */
    snippet: async (
      _: any,
      { id }: any,
      { prisma, userId, userRole }: Context
    ) => {
      const snippet = await prisma.snippet.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!snippet) {
        throw new Error("Snippet not found");
      }

      if (snippet.status === "APPROVED") return snippet;

      if (userRole === "ADMIN") return snippet;

      if (userId && snippet.authorId === userId) return snippet;

      throw new Error("Not authorized to view this snippet");
    },

    /**
     * Get all snippets authored by the current user (any status).
     */
    mySnippets: async (_: any, __: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.snippet.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      });
    },

    /**
     * Admin: Get all snippets (any status).
     */
    allSnippets: async (_: any, __: any, { prisma, userRole }: Context) => {
      if (userRole !== "ADMIN") throw new Error("Not authorized");
      return prisma.snippet.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: true },
      });
    },

    /**
     * Admin: Get all pending snippets.
     */
    pendingSnippets: async (_: any, __: any, { prisma, userRole }: Context) => {
      if (userRole !== "ADMIN") throw new Error("Not authorized");
      return prisma.snippet.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      });
    },
  },

  Mutation: {
    /**
     * Create a new snippet (user only).
     */
    createSnippet: async (
      _: any,
      { input }: any,
      { prisma, userId }: Context
    ) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.snippet.create({
        data: {
          ...input,
          authorId: userId,
        },
        include: { author: true },
      });
    },

    /**
     * Update a snippet (author only).
     */
    updateSnippet: async (
      _: any,
      { id, input }: any,
      { prisma, userId }: Context
    ) => {
      if (!userId) throw new Error("Not authenticated");
      const snippet = await prisma.snippet.findUnique({ where: { id } });
      if (!snippet || snippet.authorId !== userId) {
        throw new Error("Snippet not found or not authorized");
      }
      return prisma.snippet.update({
        where: { id },
        data: input,
        include: { author: true },
      });
    },

    /**
     * Delete a snippet (author only).
     */
    deleteSnippet: async (_: any, { id }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      const snippet = await prisma.snippet.findUnique({ where: { id } });
      if (!snippet || snippet.authorId !== userId) {
        throw new Error("Snippet not found or not authorized");
      }
      await prisma.snippet.delete({ where: { id } });
      return true;
    },

    /**
     * Approve a snippet (admin only).
     * - Updates status
     * - Sends approval email (fire-and-forget)
     */
    approveSnippet: async (
      _: any,
      { id }: any,
      { prisma, userRole }: Context
    ) => {
      if (userRole !== "ADMIN") throw new Error("Not authorized");
      const snippet = await prisma.snippet.update({
        where: { id },
        data: { status: "APPROVED" },
        include: { author: true },
      });
      sendSnippetApprovedEmail(
        snippet.author.email,
        snippet.author.email.split("@")[0],
        snippet.title,
        snippet.id
      ).catch(console.error);
      return snippet;
    },

    /**
     * Reject a snippet (admin only).
     * - Updates status
     * - Sends rejection email (fire-and-forget)
     */
    rejectSnippet: async (
      _: any,
      { id, reason }: any,
      { prisma, userRole }: Context
    ) => {
      if (userRole !== "ADMIN") throw new Error("Not authorized");
      const snippet = await prisma.snippet.update({
        where: { id },
        data: { status: "REJECTED" },
        include: { author: true },
      });
      sendSnippetRejectedEmail(
        snippet.author.email,
        snippet.author.email.split("@")[0],
        snippet.title,
        reason
      ).catch(console.error);
      return snippet;
    },
  },

  Snippet: {
    /**
     * Resolve the author field for a snippet.
     */
    author: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};
