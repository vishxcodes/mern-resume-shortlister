import { v2 as cloudinary } from "cloudinary";

const sanitize = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^[-"']+|[-"']+$/g, "");
};

export const initCloudinary = () => {
  const cloud_name = sanitize(process.env.CLOUDINARY_CLOUD_NAME);
  const api_key = sanitize(process.env.CLOUDINARY_API_KEY);
  const api_secret = sanitize(process.env.CLOUDINARY_API_SECRET);

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
    console.log(`☁️ Cloudinary configured successfully (cloud: ${cloud_name})`);
  } else {
    console.warn("⚠️ Cloudinary credentials not fully configured in environment.");
  }

  return cloudinary;
};

export default cloudinary;
