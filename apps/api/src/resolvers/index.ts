export const resolvers = {
  Query: {
    hello: () => "Hello world!",
    users: async (_, __, { prisma }) => {
      return await prisma.user.findMany();
    },
  },
};
