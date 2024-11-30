// api/files/upload
import { v4 as uuidv4 } from 'uuid';
import { readMultipartFormData } from "h3";
import { uploadToCloudinary } from "../../services/cloudinary";
import { encrypt } from "../../services/encryption";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({ statusCode: 400, message: "No data provided" });
  }

  const uploadedFiles: { encryptedMetadata: string; url: string }[] = [];

  for (const field of formData) {
    if (field.name === "file" && field.filename) {
      // Validate file size
      if (field.data.length > MAX_FILE_SIZE) {
        throw createError({
          statusCode: 400,
          message: `File "${field.filename}" is too large. Maximum size is 25 MB.`,
        });
      }

      try {

        const fileUuid = uuidv4();
        
        // Upload the file to Cloudinary
        const result = await uploadToCloudinary(field.data, fileUuid);

        const metadata = {
          format: result.format,
          version: result.version,
          publicId: result.public_id,
        };

        // Encrypt metadata
        const encryptedMetadata = encrypt(JSON.stringify(metadata));

        // Add to response
        uploadedFiles.push({
          encryptedMetadata,
          url: result.secure_url,
        });
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw createError({
          statusCode: 500,
          message: `Failed to upload file: ${field.filename}`,
        });
      }
    }
  }

  return {
    success: true,
    files: uploadedFiles,
  };
});
