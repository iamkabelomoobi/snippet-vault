import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { logger } from "../utils";
import { resolvers } from "../resolvers";
import { typeDefs } from "../schemas";

export const createApolloServer = async (httpServer: http.Server) => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async requestDidStart() {
          return {
            async didEncounterErrors({ errors }) {
              logger.error("GraphQL Error", { errors });
            },
          };
        },
      },
    ],
    csrfPrevention: true,
    cache: "bounded",
    formatError: (formattedError, error) => {
      logger.error("GraphQL Formatted Error", { formattedError, error });
      return {
        ...formattedError,
        extensions: {
          ...formattedError.extensions,
          code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR",
        },
      };
    },
  });

  await server.start();
  return server;
};
