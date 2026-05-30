"use server";

import { revalidatePath } from "next/cache";

import {
  deletePhotoFromCloudinary,
  extractCloudinaryPublicId,
  isCloudinaryConfigured,
  uploadPhotoToCloudinary,
} from "@/src/lib/cloudinary";
import { prisma } from "@/src/lib/prisma";

export type AdminActionState = {
  message: string;
  photoId?: string;
  status: "idle" | "success" | "error";
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

function getNullableText(formData: FormData, name: string) {
  return getOptionalText(formData, name) ?? null;
}

function getNullableInteger(formData: FormData, name: string) {
  return getOptionalInteger(formData, name) ?? null;
}

function getOptionalDate(formData: FormData, name: string) {
  const value = getText(formData, name);
  return value ? new Date(`${value}T00:00:00.000Z`) : undefined;
}

function getNullableDate(formData: FormData, name: string) {
  return getOptionalDate(formData, name) ?? null;
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

function authorizeAdmin(formData: FormData) {
  const adminUploadKey = process.env.ADMIN_UPLOAD_KEY;

  if (!adminUploadKey) {
    return fail("ADMIN_UPLOAD_KEY belum diset di environment.");
  }

  if (getText(formData, "adminKey") !== adminUploadKey) {
    return fail("Admin key salah.");
  }

  return undefined;
}

export async function uploadPhoto(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authError = authorizeAdmin(formData);

  if (authError) {
    return authError;
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
        cloudinaryPublicId: uploaded.public_id,
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

export async function updatePhoto(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authError = authorizeAdmin(formData);

  if (authError) {
    return authError;
  }

  const id = getText(formData, "id");
  const title = getText(formData, "title");

  if (!id) {
    return fail("ID foto tidak valid.");
  }

  if (!title) {
    return fail("Judul foto wajib diisi.");
  }

  try {
    const photo = await prisma.photo.update({
      data: {
        altText: getNullableText(formData, "altText"),
        aperture: getNullableText(formData, "aperture"),
        camera: getNullableText(formData, "camera"),
        collection: getNullableText(formData, "collection"),
        colorProfile: getNullableText(formData, "colorProfile"),
        copyright: getNullableText(formData, "copyright"),
        country: getNullableText(formData, "country"),
        description: getNullableText(formData, "description"),
        dominantColor: getNullableText(formData, "dominantColor"),
        focalLength: getNullableText(formData, "focalLength"),
        iso: getNullableInteger(formData, "iso"),
        lens: getNullableText(formData, "lens"),
        location: getNullableText(formData, "location"),
        published: formData.get("published") === "on",
        shutterSpeed: getNullableText(formData, "shutterSpeed"),
        takenAt: getNullableDate(formData, "takenAt"),
        title,
      },
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      message: `"${photo.title}" berhasil diperbarui.`,
      photoId: photo.id,
      status: "success",
    };
  } catch (error) {
    console.error("Failed to update photo", error);
    return fail("Update foto gagal. Cek data dan koneksi database.");
  }
}

export async function deletePhoto(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authError = authorizeAdmin(formData);

  if (authError) {
    return authError;
  }

  const id = getText(formData, "id");

  if (!id) {
    return fail("ID foto tidak valid.");
  }

  try {
    const photo = await prisma.photo.findUnique({
      select: {
        cloudinaryPublicId: true,
        id: true,
        imageUrl: true,
        title: true,
      },
      where: { id },
    });

    if (!photo) {
      return fail("Foto tidak ditemukan.");
    }

    await prisma.photo.delete({
      where: { id },
    });

    const publicId =
      photo.cloudinaryPublicId ?? extractCloudinaryPublicId(photo.imageUrl);

    if (publicId && isCloudinaryConfigured()) {
      try {
        await deletePhotoFromCloudinary(publicId);
      } catch (error) {
        console.error("Failed to delete Cloudinary asset", error);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      message: `"${photo.title}" berhasil dihapus dari database.`,
      status: "success",
    };
  } catch (error) {
    console.error("Failed to delete photo", error);
    return fail("Hapus foto gagal. Cek koneksi database.");
  }
}
