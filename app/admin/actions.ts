"use server";

import { revalidatePath } from "next/cache";

import { uploadPhotoToCloudinary } from "@/src/lib/cloudinary";
import { prisma } from "@/src/lib/prisma";

export type AdminActionState = {
  message: string;
  photoId?: string;
  status: "idle" | "success" | "error";
};

export const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};

const maxImageSize = 10 * 1024 * 1024;

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value.length > 0 ? value : undefined;
}

function getOptionalInteger(formData: FormData, name: string) {
  const value = getText(formData, name);
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getOptionalDate(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value ? new Date(`${value}T00:00:00.000Z`) : undefined;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "photo"}-${Date.now()}`;
}

function fail(message: string): AdminActionState {
  return {
    message,
    status: "error",
  };
}

export async function uploadPhoto(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const adminUploadKey = process.env.ADMIN_UPLOAD_KEY;

  if (!adminUploadKey) {
    return fail("ADMIN_UPLOAD_KEY belum diset di environment.");
  }

  if (getText(formData, "adminKey") !== adminUploadKey) {
    return fail("Admin key salah.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return fail("Cloudinary env belum lengkap.");
  }

  const title = getText(formData, "title");
  const image = formData.get("image");

  if (!title) {
    return fail("Judul foto wajib diisi.");
  }

  if (!(image instanceof File) || image.size === 0) {
    return fail("Pilih file foto terlebih dahulu.");
  }

  if (!image.type.startsWith("image/")) {
    return fail("File harus berupa gambar.");
  }

  if (image.size > maxImageSize) {
    return fail("Ukuran gambar maksimal 10MB.");
  }

  try {
    const location = getOptionalText(formData, "location");
    const uploaded = await uploadPhotoToCloudinary(image, {
      alt: getOptionalText(formData, "altText"),
      location,
      title,
    });

    const photo = await prisma.photo.create({
      data: {
        altText: getOptionalText(formData, "altText") ?? title,
        aperture: getOptionalText(formData, "aperture"),
        blurDataUrl: undefined,
        camera: getOptionalText(formData, "camera"),
        collection: getOptionalText(formData, "collection"),
        colorProfile: getOptionalText(formData, "colorProfile") ?? "sRGB",
        copyright:
          getOptionalText(formData, "copyright") ?? "(c) Yan Saputra",
        country: getOptionalText(formData, "country"),
        description: getOptionalText(formData, "description"),
        dominantColor:
          getOptionalText(formData, "dominantColor") ?? "#64748b",
        fileType: uploaded.format
          ? `${uploaded.format.toUpperCase()} display copy`
          : image.type,
        focalLength: getOptionalText(formData, "focalLength"),
        height: uploaded.height,
        imageUrl: uploaded.secure_url,
        isDownloadable: false,
        iso: getOptionalInteger(formData, "iso"),
        lens: getOptionalText(formData, "lens"),
        location,
        published: formData.get("published") === "on",
        shutterSpeed: getOptionalText(formData, "shutterSpeed"),
        slug: slugify(title),
        takenAt: getOptionalDate(formData, "takenAt"),
        title,
        width: uploaded.width,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      message: `"${photo.title}" berhasil diupload dan disimpan ke database.`,
      photoId: photo.id,
      status: "success",
    };
  } catch (error) {
    console.error("Failed to upload photo", error);
    return fail("Upload gagal. Cek koneksi Cloudinary, Neon, dan ukuran file.");
  }
}
