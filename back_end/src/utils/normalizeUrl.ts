export const normalizeResumeUrl = (url: string): string => {
  // 🔹 Google Drive
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  // 🔹 Dropbox
  if (url.includes("dropbox.com")) {
    return url.replace("dl=0", "dl=1");
  }

  // 🔹 OneDrive
  if (url.includes("onedrive.live.com")) {
    return url.replace("view.aspx", "download.aspx");
  }

  // 🔹 Already direct
  return url;
};