import { decrypt } from "../../services/encryption";

export default defineEventHandler(async (event) => {
  const { encryptedMetadata } = await readBody(event);

  if (!encryptedMetadata) {
    throw createError({ statusCode: 400, message: "Encrypted metadata is required" });
  }

  try {
    // Decrypt metadata
    const decryptedData = decrypt(encryptedMetadata);

    const metadata = JSON.parse(decryptedData);

    // Construct public URL
    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${metadata.version}/${metadata.publicId}.${metadata.format}`;

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("Error retrieving file:", error); // Log errors
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve file",
    });
  }
});
