import { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";

export const applyApolloMiddleware = (
  app: Application,
  server: ApolloServer
) => {
  app.use(
    "/graphql",
    express.json({ limit: process.env.JSON_BODY_LIMIT || "10kb" }),
    expressMiddleware(server)
  );
};
