import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Configure nodemailer transporter for SMTP or local dev (MailDev).
 */
const transporter = nodemailer.createTransport({
  host: isDevelopment ? "localhost" : process.env.SMTP_HOST,
  port: parseInt(isDevelopment ? "1025" : process.env.SMTP_PORT || "587"),
  secure: false,
  auth: isDevelopment
    ? false
    : {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
} as SMTPTransport.Options);

/**
 * Configure Mailgen for beautiful HTML/text emails.
 */
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Snippet Vault",
    link: "http://localhost:3000",
    logo: "https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=Snippet+Vault",
    logoHeight: "50px",
    copyright: "Copyright © 2024 Snippet Vault.",
  },
});

/**
 * Send a password reset email with a secure token link.
 */
export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  const emailContent = {
    body: {
      name: email.split("@")[0],
      intro:
        "You have received this email because a password reset request for your Snippet Vault account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#3B82F6",
          text: "Reset Your Password",
          link: resetUrl,
        },
      },
      outro: [
        "If you did not request a password reset, no further action is required on your part.",
        "This link will expire in 1 hour for security reasons.",
      ],
      signature: false,
    },
  };

  const emailHtml = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const mailOptions = {
    from: isDevelopment
      ? "Snippet Vault <noreply@snippetvault.dev>"
      : `Snippet Vault <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password - Snippet Vault",
    html: emailHtml,
    text: emailText,
  };

  try {
    await transporter.sendMail(mailOptions);
    if (isDevelopment) {
      console.log(
        `Development email sent to ${email}. Check MailDev at http://localhost:1080`
      );
    }
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Failed to send reset email");
  }
}

/**
 * Send a welcome email to new users after registration.
 */
export async function sendWelcomeEmail(email: string, userName: string) {
  const emailContent = {
    body: {
      name: userName,
      intro: "Welcome to Snippet Vault! We're excited to have you on board.",
      action: {
        instructions:
          "To get started with organizing your code snippets, please click here:",
        button: {
          color: "#22C55E",
          text: "Get Started",
          link: "http://localhost:3000/create",
        },
      },
      outro: [
        "Need help, or have questions? Just reply to this email, we'd love to help.",
        "Thanks for joining Snippet Vault!",
      ],
      signature: "The Snippet Vault Team",
    },
  };

  const emailHtml = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const mailOptions = {
    from: isDevelopment
      ? "Snippet Vault <noreply@snippetvault.dev>"
      : `Snippet Vault <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Snippet Vault!",
    html: emailHtml,
    text: emailText,
  };

  try {
    await transporter.sendMail(mailOptions);
    if (isDevelopment) {
      console.log(
        `Welcome email sent to ${email}. Check MailDev at http://localhost:1080`
      );
    }
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

/**
 * Send an approval notification email when a snippet is approved.
 */
export async function sendSnippetApprovedEmail(
  email: string,
  userName: string,
  snippetTitle: string,
  snippetId: string
) {
  const snippetUrl = `http://localhost:3000/snippets/${snippetId}`;
  const emailContent = {
    body: {
      name: userName,
      intro: `Great news! Your code snippet "${snippetTitle}" has been approved and is now live on Snippet Vault.`,
      action: {
        instructions: "Click the button below to view your published snippet:",
        button: {
          color: "#3B82F6",
          text: "View Snippet",
          link: snippetUrl,
        },
      },
      outro: [
        "Your snippet is now visible to the community and can be discovered by other developers.",
        "Thank you for contributing to Snippet Vault!",
      ],
      signature: "The Snippet Vault Team",
    },
  };

  const emailHtml = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const mailOptions = {
    from: isDevelopment
      ? "Snippet Vault <noreply@snippetvault.dev>"
      : `Snippet Vault <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Your snippet "${snippetTitle}" has been approved!`,
    html: emailHtml,
    text: emailText,
  };

  try {
    await transporter.sendMail(mailOptions);
    if (isDevelopment) {
      console.log(
        `Snippet Approval email sent to ${email}. Check MailDev at http://localhost:1080`
      );
    }
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }
}

/**
 * Send a rejection notification email when a snippet is rejected.
 * Optionally includes a reason for rejection.
 */
export async function sendSnippetRejectedEmail(
  email: string,
  userName: string,
  snippetTitle: string,
  reason?: string
) {
  const emailContent = {
    body: {
      name: userName,
      intro: `We regret to inform you that your code snippet "${snippetTitle}" was not approved for publication on Snippet Vault.`,
      table: reason
        ? {
            data: [
              {
                item: "Reason",
                description: reason,
              },
            ],
            columns: {
              customWidth: {
                item: "20%",
                description: "80%",
              },
            },
          }
        : undefined,
      action: {
        instructions:
          "You can edit and resubmit your snippet, or create a new one:",
        button: {
          color: "#F59E0B",
          text: "Create New Snippet",
          link: "http://localhost:3000/create",
        },
      },
      outro: [
        "If you have any questions about our content guidelines, please don't hesitate to reach out.",
        "We appreciate your contribution and encourage you to try again!",
      ],
      signature: "The Snippet Vault Team",
    },
  };

  const emailHtml = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const mailOptions = {
    from: isDevelopment
      ? "Snippet Vault <noreply@snippetvault.dev>"
      : `Snippet Vault <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Update on your snippet "${snippetTitle}"`,
    html: emailHtml,
    text: emailText,
  };

  try {
    await transporter.sendMail(mailOptions);
    if (isDevelopment) {
      console.log(
        `Snippet Rejection email sent to ${email}. Check MailDev at http://localhost:1080`
      );
    }
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
}
