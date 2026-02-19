import { drive_v3, google } from "googleapis";
import { getGoogleAuthClient, wrapGoogleApiCall } from "./auth_sheet";
import { Readable } from "stream";

export async function uploadResumeToDrive(
  formData: FormData,
  fileName: string
) {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata: drive_v3.Schema$File = {
    name: fileName,
    parents: folderId ? [folderId] : undefined,
  };

  // Get the uploaded file from FormData
  const file = formData.get("cvFile") as File;
  if (!file) throw new Error("No file provided");

  // Convert browser File -> Buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const media = {
    mimeType: file.type || "application/pdf",
    body: stream, 
  };

  const res = await wrapGoogleApiCall(() =>
    drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    })
  );

  return {
    id: res.data.id,
    viewLink: res.data.webViewLink,
    downloadLink: res.data.webContentLink,
  };
}

export async function getResumeFile(fileId: string) {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const response = await wrapGoogleApiCall(() =>
    drive.files.get(
      { fileId, alt: "media" }, // fetch file content
      { responseType: "stream" }
    )
  );

  return response.data; // stream of PDF file
}

export async function deleteResumeFile(fileId: string) {
  try {
    const auth = await getGoogleAuthClient();
    const drive = google.drive({ version: "v3", auth });

    await wrapGoogleApiCall(() =>
      drive.files.delete({
        fileId,
      })
    );

    return { success: true };
  } catch (error) {
    console.error(`Error deleting file from Google Drive: ${error}`);
    return { success: false, error: "Failed to delete file from Google Drive" };
  }
}
