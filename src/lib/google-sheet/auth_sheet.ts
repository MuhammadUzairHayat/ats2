import { google } from "googleapis";
import { UserSession } from "@/types";
import { getSession } from "../auth";
import { AuthExpiredError } from "../errors";

export async function wrapGoogleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      throw new AuthExpiredError();
    }
    throw error;
  }
}

export async function getGoogleAuthClient() {
  const serverSession = await getSession();
  const session = serverSession as UserSession;

  if (!session?.accessToken) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: session.accessToken,
  });

  return auth;
}

export async function getSheetsAndID() {
  const auth = await getGoogleAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_DRIVE_FILE_ID;
  return { sheets, spreadsheetId };
}
