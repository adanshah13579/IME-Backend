import fetch from "node-fetch";
import FormData from "form-data";

const UPLOAD_URL = "https://srv694651.hstgr.cloud/storage/upload";
const API_KEY = "ayzenn09876@";

// Upload a single file (image or video)
// Assuming uploadFile handles the upload to your storage service
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
  
    const response = await fetch("https://srv694651.hstgr.cloud/storage/upload", {
      method: "POST",
      headers: {
        "x-api-key": "ayzenn09876@", // Your API key
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Error uploading file");
    }
  
    const data = await response.json();
  
    if (data && data.fileUrl) {
      return data.fileUrl; // Assuming the server returns fileUrl
    }
  
    throw new Error("Failed to get file URL");
  };
  

export { uploadFile };
