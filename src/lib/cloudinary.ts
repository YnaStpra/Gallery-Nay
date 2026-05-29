import { Buffer } from "node:buffer";

import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

type UploadMetadata = {
  title: string;
  alt?: string;
  location?: string;
};

const cloudinaryEnvKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

export function getMissingCloudinaryEnv() {
  return cloudinaryEnvKeys.filter((key) => !process.env[key]);
}

export function isCloudinaryConfigured() {
  return getMissingCloudinaryEnv().length === 0;
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    secure: true,
  });
}

export async function uploadPhotoToCloudinary(
  file: File,
  metadata: UploadMetadata,
) {
  configureCloudinary();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        context: {
          alt: metadata.alt ?? metadata.title,
          caption: metadata.title,
          location: metadata.location ?? "",
        },
        folder: "gallery-nay",
        overwrite: false,
        resource_type: "image",
        unique_filename: true,
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return an upload result"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}
