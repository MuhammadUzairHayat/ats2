import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { checkDriveAccess } from "./checkFileAccess";
import { JWT } from "next-auth/jwt";
import { UserSession } from "@/types";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/drive.file", // allow file upload
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      // Only check access if using Google
      if (account?.provider === "google" && account.access_token) {
        const hasAccess = await checkDriveAccess(account.access_token);
        if (!hasAccess) {
          return false; // This will redirect to the error page
        }
      }
      return true;
    },
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      account: {
        access_token?: string;
        refresh_token?: string;
        expires_at?: number;
      } | null;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      // If the access token has expired, refresh it
      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });
          const data = await response.json();
          token.accessToken = data.access_token;
          token.expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
        } catch (error) {
          console.error("Error refreshing access token", error);
          // If refresh fails, clear the tokens
          token.accessToken = undefined;
          token.refreshToken = undefined;
          token.expiresAt = undefined;
        }
      }

      return token;
    },
    async session({ session, token }: { session: UserSession; token: JWT }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  //   debug: true,
};

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}