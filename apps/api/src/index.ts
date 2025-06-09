import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { typeDefs } from "./graphql/schema/schema";
import { resolvers } from "./graphql/resolvers";
import { createContext } from "./graphql/context/context";
import { setupFileUpload } from "./middlewares/upload";

/**
 * Bootstraps and starts the Express + Apollo GraphQL server.
 * - Sets up file upload/download endpoints
 * - Configures CORS for frontend access
 * - Mounts Apollo GraphQL middleware at /graphql
 */
async function startServer() {
  const app = express();
  const port = process.env.PORT || 4000;

  setupFileUpload(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

// Start the server and handle startup errors
startServer().catch((error) => {
  console.error("Error starting server:", error);
});
