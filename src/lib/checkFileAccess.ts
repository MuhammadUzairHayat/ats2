export async function checkDriveAccess(accessToken: string): Promise<boolean> {
  const fileId = process.env.GOOGLE_DRIVE_FILE_ID

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id`
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.ok
  } catch (error) {
     console.error(`Error checking Google Drive access: ${error}`)
    return false
  }
}
