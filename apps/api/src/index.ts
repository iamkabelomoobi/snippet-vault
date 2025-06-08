import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { setupFileUpload } from './upload';

async function startServer() {
  const app = express();
  const port = process.env.PORT || 4000;

  // File upload middleware
  setupFileUpload(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:3000'],
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

startServer().catch((error) => {
  console.error('Error starting server:', error);
});