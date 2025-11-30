export const uploadToCloudinary = async (file, type = "image") => {
  const url = `https://api.cloudinary.com/v1_1/ddbfao0dy/${type}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ecommerce-unsigned");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};
