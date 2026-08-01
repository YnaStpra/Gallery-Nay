"use server";

import { revalidatePath } from "next/cache";

import {
  deletePhotoFromCloudinary,
  extractCloudinaryPublicId,
  isCloudinaryConfigured,
  uploadRawFileToCloudinary,
  uploadOriginalImageToCloudinary,
  uploadPhotoToCloudinary,
} from "@/src/lib/cloudinary";
import { slugify } from "@/src/lib/photo-auto-fill";
import { prisma } from "@/src/lib/prisma";

export type AdminActionState = {
  message: string;
  photoId?: string;
  status: "idle" | "success" | "error";
};

const maxImageSize = 10 * 1024 * 1024;
const maxOriginalImageSize = 100 * 1024 * 1024;
const maxPresetSize = 100 * 1024 * 1024;
const allowedPresetExtensions = new Set([
  ".cube",
  ".xmp",
  ".dng",
  ".3dl",
  ".look",
  ".icc",
  ".icm",
]);

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

function fail(message: string): AdminActionState {
  return {
    message,
    status: "error",
  };
}

function getFileExtension(fileName: string) {
  const match = fileName.match(/\.[^.]+$/);
  return match?.[0].toLowerCase() ?? "";
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
  const slugInput = getOptionalText(formData, "slug");
  const image = formData.get("image");
  const originalImage = formData.get("originalImage");
  const preset = formData.get("preset");

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

  if (originalImage && !(originalImage instanceof File)) {
    return fail("Original image tidak valid.");
  }

  if (originalImage instanceof File && originalImage.size > 0) {
    if (!originalImage.type.startsWith("image/")) {
      return fail("Original image harus berupa gambar.");
    }

    if (originalImage.size > maxOriginalImageSize) {
      return fail("Ukuran original image maksimal 100MB.");
    }
  }

  if (preset && !(preset instanceof File)) {
    return fail("Preset tidak valid.");
  }

  if (preset instanceof File && preset.size > 0) {
    const extension = getFileExtension(preset.name);

    if (!allowedPresetExtensions.has(extension)) {
      return fail("Format preset tidak didukung.");
    }

    if (preset.size > maxPresetSize) {
      return fail("Ukuran preset maksimal 100MB.");
    }
  }

  try {
    const location = getOptionalText(formData, "location");
    const presetName = getOptionalText(formData, "lutName");
    const presetVersion = getOptionalText(formData, "lutVersion");
    const presetDescription = getOptionalText(formData, "lutDescription");
    const editingSoftware = getOptionalText(formData, "editingSoftware");
    const cameraProfile = getOptionalText(formData, "cameraProfile");
    const allowDownload = formData.get("allowDownload") === "on";
    const isPremium = formData.get("isPremium") === "on";
    const uploaded = await uploadPhotoToCloudinary(image, {
      alt: getOptionalText(formData, "altText"),
      location,
      title,
    });
    const originalFile =
      originalImage instanceof File && originalImage.size > 0
        ? originalImage
        : null;
    const uploadedOriginal = originalFile
      ? await uploadOriginalImageToCloudinary(originalFile, {
          fileName: originalFile.name,
        })
      : null;
    const presetFile =
      preset instanceof File && preset.size > 0 ? preset : null;
    const uploadedPreset = presetFile
      ? await uploadRawFileToCloudinary(presetFile, {
          fileName: presetFile.name,
        })
      : null;

    const photo = await prisma.photo.create({
      data: {
        altText: getOptionalText(formData, "altText") ?? title,
        aperture: getOptionalText(formData, "aperture"),
        blurDataUrl: undefined,
        camera: getOptionalText(formData, "camera"),
        cloudinaryPublicId: uploaded.public_id,
        collection: getOptionalText(formData, "collection"),
        colorProfile: getOptionalText(formData, "colorProfile") ?? "sRGB",
        copyright: getOptionalText(formData, "copyright") ?? "(c) Yan Saputra",
        country: getOptionalText(formData, "country"),
        description: getOptionalText(formData, "description"),
        shootingConditions: getOptionalText(formData, "shootingConditions"),
        shootingChallenges: getOptionalText(formData, "shootingChallenges"),
        waitingTime: getOptionalText(formData, "waitingTime"),
        interestingFacts: getOptionalText(formData, "interestingFacts"),
        behindTheShot: getOptionalText(formData, "behindTheShot"),
        dominantColor: getOptionalText(formData, "dominantColor") ?? "#64748b",
        fileType: uploaded.format
          ? `${uploaded.format.toUpperCase()} display copy`
          : image.type,
        focalLength: getOptionalText(formData, "focalLength"),
        height: uploaded.height,
        imageUrl: uploaded.secure_url,
        isDownloadable: false,
        allowDownload,
        cameraProfile,
        originalFileSize: originalFile?.size ?? null,
        originalFileType: originalFile?.type ?? null,
        originalHeight: uploadedOriginal?.height ?? null,
        originalImageUrl: uploadedOriginal?.secure_url ?? null,
        originalPublicId: uploadedOriginal?.public_id ?? null,
        originalWidth: uploadedOriginal?.width ?? null,
        iso: getOptionalInteger(formData, "iso"),
        isPremium,
        lens: getOptionalText(formData, "lens"),
        location,
        lutDescription: presetDescription,
        lutFileName: presetFile?.name ?? null,
        lutFileSize: presetFile?.size ?? null,
        lutFormat: presetFile
          ? getFileExtension(presetFile.name).replace(/^\./, "").toUpperCase()
          : null,
        lutName: presetName,
        lutUrl: uploadedPreset?.secure_url ?? null,
        lutVersion: presetVersion,
        editingSoftware,
        published: formData.get("published") === "on",
        uploadedAt: presetFile ? new Date() : null,
        shutterSpeed: getOptionalText(formData, "shutterSpeed"),
        slug: slugify(slugInput ?? title),
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
        shootingConditions: getNullableText(formData, "shootingConditions"),
        shootingChallenges: getNullableText(formData, "shootingChallenges"),
        waitingTime: getNullableText(formData, "waitingTime"),
        interestingFacts: getNullableText(formData, "interestingFacts"),
        behindTheShot: getNullableText(formData, "behindTheShot"),
        dominantColor: getNullableText(formData, "dominantColor"),
        focalLength: getNullableText(formData, "focalLength"),
        iso: getNullableInteger(formData, "iso"),
        lens: getNullableText(formData, "lens"),
        location: getNullableText(formData, "location"),
        published: formData.get("published") === "on",
        shutterSpeed: getNullableText(formData, "shutterSpeed"),
        takenAt: getNullableDate(formData, "takenAt"),
        title,
        allowDownload: formData.get("allowDownload") === "on",
        cameraProfile: getNullableText(formData, "cameraProfile"),
        editingSoftware: getNullableText(formData, "editingSoftware"),
        isPremium: formData.get("isPremium") === "on",
        lutDescription: getNullableText(formData, "lutDescription"),
        lutFileName: getNullableText(formData, "lutFileName"),
        lutFileSize: getNullableInteger(formData, "lutFileSize"),
        lutFormat: getNullableText(formData, "lutFormat"),
        lutName: getNullableText(formData, "lutName"),
        lutUrl: getNullableText(formData, "lutUrl"),
        lutVersion: getNullableText(formData, "lutVersion"),
        originalFileSize: getNullableInteger(formData, "originalFileSize"),
        originalFileType: getNullableText(formData, "originalFileType"),
        originalHeight: getNullableInteger(formData, "originalHeight"),
        originalImageUrl: getNullableText(formData, "originalImageUrl"),
        originalPublicId: getNullableText(formData, "originalPublicId"),
        originalWidth: getNullableInteger(formData, "originalWidth"),
        uploadedAt: getNullableDate(formData, "uploadedAt"),
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

export async function createStory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authError = authorizeAdmin(formData);
  if (authError) {
    return authError;
  }

  const title = getText(formData, "title");
  const coverImage = getText(formData, "coverImage");

  if (!title) {
    return fail("Judul story wajib diisi.");
  }

  if (!coverImage) {
    return fail("URL cover image wajib diisi.");
  }

  try {
    const content = getText(formData, "content");
    const parsedContent = content ? JSON.parse(content) : [];
    const story = await prisma.story.create({
      data: {
        title,
        slug: slugify(title),
        excerpt: getOptionalText(formData, "excerpt"),
        coverImage,
        content: Array.isArray(parsedContent) ? parsedContent : [],
        location: getOptionalText(formData, "location"),
        country: getOptionalText(formData, "country"),
        published: formData.get("published") === "on",
        publishedAt: getOptionalDate(formData, "publishedAt"),
      },
    });

    revalidatePath("/stories");
    revalidatePath("/admin/stories");

    return {
      message: `"${story.title}" berhasil dibuat.`,
      status: "success",
      photoId: story.id,
    };
  } catch (error) {
    console.error("Failed to create story", error);
    return fail("Pembuatan story gagal. Pastikan JSON content valid.");
  }
}

export async function updateStory(
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
    return fail("ID story tidak valid.");
  }

  if (!title) {
    return fail("Judul story wajib diisi.");
  }

  try {
    const content = getText(formData, "content");
    const parsedContent = content ? JSON.parse(content) : [];

    const story = await prisma.story.update({
      where: { id },
      data: {
        title,
        excerpt: getOptionalText(formData, "excerpt"),
        coverImage: getText(formData, "coverImage"),
        content: Array.isArray(parsedContent) ? parsedContent : [],
        location: getOptionalText(formData, "location"),
        country: getOptionalText(formData, "country"),
        published: formData.get("published") === "on",
        publishedAt: getOptionalDate(formData, "publishedAt"),
      },
    });

    revalidatePath("/stories");
    revalidatePath("/admin/stories");

    return {
      message: `"${story.title}" berhasil diperbarui.`,
      status: "success",
      photoId: story.id,
    };
  } catch (error) {
    console.error("Failed to update story", error);
    return fail("Update story gagal. Pastikan JSON content valid.");
  }
}

export async function deleteStory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authError = authorizeAdmin(formData);
  if (authError) {
    return authError;
  }

  const id = getText(formData, "id");

  if (!id) {
    return fail("ID story tidak valid.");
  }

  try {
    const story = await prisma.story.delete({
      where: { id },
    });

    revalidatePath("/stories");
    revalidatePath("/admin/stories");

    return {
      message: `"${story.title}" berhasil dihapus.`,
      status: "success",
    };
  } catch (error) {
    console.error("Failed to delete story", error);
    return fail("Hapus story gagal. Cek koneksi database.");
  }
}
