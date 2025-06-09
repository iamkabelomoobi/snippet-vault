import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Context } from "../context/context";
import { sendResetEmail, sendWelcomeEmail } from "../../utils/email";

export const authResolvers = {
  Mutation: {
    /**
     * Register a new user.
     * - Hashes password
     * - Creates user in DB
     * - Sends welcome email (async)
     * - Returns JWT and user
     */
    register: async (_: any, { email, password }: any, { prisma }: Context) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Send welcome email
      sendWelcomeEmail(email, email.split("@")[0]).catch(console.error);

      return { token, user };
    },

    /**
     * Login user.
     * - Checks email and password
     * - Returns JWT and user
     */
    login: async (_: any, { email, password }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    /**
     * Request password reset.
     * - Generates reset token and expiry
     * - Sends reset email (async)
     * - Always returns true 
     */
    forgotPassword: async (_: any, { email }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return true; 
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); 

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email
      sendResetEmail(email, resetToken).catch(console.error);
      return true;
    },

    /**
     * Reset password using token.
     * - Validates token and expiry
     * - Hashes new password
     * - Clears reset token and expiry
     */
    resetPassword: async (
      _: any,
      { token, password }: any,
      { prisma }: Context
    ) => {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return true;
    },
  },
};
