"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { google } from "googleapis";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function sendEmail(to, subject, htmlBody) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // Get OAuth tokens for the user
  const tokens = await clerk.users.getUserOauthAccessToken(userId, "google");
  if (!tokens?.data?.length)
    throw new Error("No Google OAuth tokens found for this user.");

  const accessToken = tokens.data[0].token;

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: authClient });

  // Proper HTML MIME email
  const messageParts = [
    `To: ${to}`,
    "Subject: " + subject,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    htmlBody,
  ];

  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log("Email sent successfully:", res.data);
  return res.data;
}
