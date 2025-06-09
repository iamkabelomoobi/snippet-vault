import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  userRole?: string;
}

/**
 * Creates the GraphQL context for each request.
 * - Attaches Prisma client.
 * - Extracts userId and userRole from JWT if present.
 */
export async function createContext({ req }: { req: any }): Promise<Context> {
  const context: Context = {
    prisma,
  };

  // Extract  token from Authorization header if present
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      context.userId = decoded.userId;
      context.userRole = decoded.role;
    } catch (error) {
      // TODO: handle token verification errors
      console.error("Invalid token:", error);
    }
  }

  return context;
}
