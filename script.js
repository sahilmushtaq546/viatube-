const fileInput = document.getElementById("videoFile");
const fileInfo = document.getElementById("fileInfo");
const localDownload = document.getElementById("localDownload");
const urlInput = document.getElementById("videoUrl");
const statusText = document.getElementById("status");
let selectedFile = null;

document.getElementById("year").textContent = new Date().getFullYear();

fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  if (!selectedFile) {
    fileInfo.textContent = "";
    localDownload.disabled = true;
    return;
  }
  if (!selectedFile.type.startsWith("video/")) {
    selectedFile = null;
    fileInput.value = "";
    fileInfo.textContent = "Please choose a video file.";
    localDownload.disabled = true;
    return;
  }
  const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
  fileInfo.textContent = `${selectedFile.name} · ${sizeMB} MB · stays on your device`;
  localDownload.disabled = false;
  statusText.textContent = "";
});

localDownload.addEventListener("click", () => {
  if (!selectedFile) return;
  const objectUrl = URL.createObjectURL(selectedFile);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = selectedFile.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  statusText.textContent = "Your selected video is being saved. Its original watermark and attribution are unchanged.";
});

document.getElementById("urlDownload").addEventListener("click", () => {
  const value = urlInput.value.trim();
  if (!value) {
    statusText.textContent = "Paste a direct link to a video file first.";
    return;
  }
  let parsed;
  try { parsed = new URL(value); } catch {
    statusText.textContent = "That link doesn't look valid. Please check it.";
    return;
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    statusText.textContent = "Please use a valid HTTPS or HTTP video-file link.";
    return;
  }
  const link = document.createElement("a");
  link.href = parsed.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open video file";
  statusText.replaceChildren("Opening the direct link. Some websites block downloads or require permission.");
  link.style.color = "#53e0d0";
  link.style.marginLeft = "6px";
  statusText.appendChild(link);
});