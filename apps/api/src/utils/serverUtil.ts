import http from "http";
import ip from "ip";
import os from "os";
import cluster from "cluster";
import { Application } from "express";
import { logger } from ".";
import { env } from "../config/env";
import { handleServerError, setupGracefulShutdown } from "./";
import { ServerOptions } from "../interfaces";
import { prisma } from "../libs/prismaLib";

export const startServer = async (
  app: Application,
  options: ServerOptions = {}
): Promise<http.Server> => {
  const { port = env.PORT, enableClusterMode = false } = options;

  const isProduction = env.NODE_ENV === "production";
  if (enableClusterMode && isProduction && cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    logger.info(`Master ${process.pid} is running with ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      logger.warn(
        `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
      );
      logger.info("Starting a new worker");
      cluster.fork();
    });

    return http.createServer((req, res) => {
      res.writeHead(500);
      res.end("Requests should be handled by worker processes");
    });
  }

  try {
    await prisma.$connect();
    logger.info("Database connection established successfully");

    if (options.enableHealthCheck) {
      app.get("/health", (req, res) => {
        res.json({
          status: "OK",
          graphql: "/graphql",
          uptime: process.uptime(),
        });
      });
    }

    if (options.rateLimitOptions) {
      const { default: rateLimit } = await import("express-rate-limit");
      app.use(
        rateLimit({
          windowMs: options.rateLimitOptions.windowMs,
          max: options.rateLimitOptions.max,
          skip: (req) => req.path === "/graphql",
        })
      );
    }

    const server = options.httpServer || http.createServer(app);

    return new Promise<http.Server>((resolve, reject) => {
      server.listen(options.port, () => {
        logger.info(`Server running on port ${options.port}`);
        logger.info(
          `GraphQL endpoint: http://${ip.address()}:${options.port}/graphql`
        );
        setupGracefulShutdown(server);
        resolve(server);
      });

      server.on("error", (error: NodeJS.ErrnoException) => {
        handleServerError(error, port);
        reject(error);
      });
    });
  } catch (error) {
    logger.error("Failed to start server", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      environment: env.NODE_ENV,
    });
    process.exit(1);
  }
};
