// server/services/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Cloudinary upload options interface
export interface CloudinaryUploadOptions {
  folder?: string; // Specify the folder for the upload
}

// Cloudinary upload response interface
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary function
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  filename: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    // Upload the file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        ...options,
        public_id: filename, // Optional: public ID for the file
        resource_type: "auto", // Automatically detect (supports pdf, png, and jpg)
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result) {
          resolve(result); // Return the result if upload is successful
        }
      }
    );

    // Convert the file buffer to a readable stream and pipe it to Cloudinary
    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};
