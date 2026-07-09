const API_URL = "http://localhost:5000/api";

export const uploadCSV = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

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