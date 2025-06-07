import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import { cleanEnv, num } from "envalid";
import http from "http";
import { applyApolloMiddleware, configureMiddlewares } from "./middlewares";
import { createApolloServer, startServer } from "./utils";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60 * 1000 }),
  RATE_LIMIT_MAX_REQUESTS: num({ default: 60 }),
});

async function initializeApp() {
  const app: Application = express();
  const httpServer = http.createServer(app);

  configureMiddlewares(app);

  const apolloServer = await createApolloServer(httpServer);
  applyApolloMiddleware(app, apolloServer);

  await startServer(app, {
    httpServer,
    port: env.PORT,
    enableClusterMode: true,
    rateLimitOptions: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
    },
  });
}

initializeApp().catch((error) => {
  console.error("Failed to initialize application:", error);
  process.exit(1);
});
