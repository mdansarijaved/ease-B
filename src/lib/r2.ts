import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

const r2Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    });

    await r2Client.send(command);

    const url = `${env.R2_PUBLIC_URL}/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteFromR2(key: string): Promise<DeleteResult> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export function extractKeyFromUrl(url: string): string | null {
  try {
    const publicUrlBase = env.R2_PUBLIC_URL;
    if (url.startsWith(publicUrlBase)) {
      return url.replace(publicUrlBase + "/", "");
    }
    return null;
  } catch {
    return null;
  }
}

export function generateFileKey(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() ?? "";
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

  const key = prefix
    ? `${prefix}/${timestamp}_${randomString}_${sanitizedName}.${extension}`
    : `${timestamp}_${randomString}_${sanitizedName}.${extension}`;

  return key;
}

export default r2Client;
