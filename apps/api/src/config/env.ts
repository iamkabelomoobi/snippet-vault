import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: num({ default: 8080 }),
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  ARGON2_PEPPER: str({ default: "some-random-pepper" }),
  JWT_SECRET: str({ default: "some-random-jwt-secret" }),
  POSTGRES_URI: str({ default: "postgresql://localhost:5432/snippet-vault" }),
  LOGTAIL_ACCESS_TOKEN: str({ default: "some-random-token" }),
});
