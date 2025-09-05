"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { google } from "googleapis";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function sendEmail(to, subject, body) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  // ✅ Get Google OAuth tokens from Clerk
  const tokens = await clerk.users.getUserOauthAccessToken(
    userId,
    "oauth_google"
  );

  if (!tokens?.data || tokens.data.length === 0) {
    throw new Error(
      "⚠️ No Google OAuth tokens found. Ensure gmail.send scope is enabled in Clerk and user signed in with Google."
    );
  }

  const accessToken = tokens.data[0].token;

  // ✅ Initialize Gmail client with the access token
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: authClient });

  // ✅ Build email RFC 2822
  const email = [
    `To: ${to}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    body,
  ].join("\n");

  const encodedMessage = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // ✅ Send email
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log("✅ Email sent:", res.data);
  return res.data;
}
