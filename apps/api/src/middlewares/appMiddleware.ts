import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

export const configureMiddlewares = (app: Application): void => {
  app.set("trust proxy", 1);
  app.use(helmet());

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 86400,
    })
  );

  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "10kb" }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: process.env.JSON_BODY_LIMIT || "10kb",
    })
  );
  app.use(compression());
  app.use(morgan("dev"));
  app.use(bodyParser.json({ limit: process.env.JSON_BODY_LIMIT || "10kb" }));
  if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
      message: "Too many requests, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use(limiter);
  }
};
