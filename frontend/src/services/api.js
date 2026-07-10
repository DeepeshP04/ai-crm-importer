const API_URL = "http://localhost:5000/api";

const uploadCSVWithProgress = async (url, formData, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress({ loaded: event.loaded, total: event.total });
        }
      };
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      let data;
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch (error) {
        reject(new Error("Invalid server response"));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.message || "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed due to a network error."));

    xhr.send(formData);
  });
};

export const uploadCSV = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  if (typeof onProgress === "function") {
    return uploadCSVWithProgress(`${API_URL}/import`, formData, onProgress);
  }

  const response = await fetch(`${API_URL}/import`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
};