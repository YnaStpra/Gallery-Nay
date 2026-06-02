"use server";

import { revalidatePath } from "next/cache";

import { DownloadRequestStatus } from "@/src/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

const validStatuses = new Set<string>(Object.values(DownloadRequestStatus));

export async function updateDownloadRequestStatus(formData: FormData) {
  const adminKey = process.env.ADMIN_UPLOAD_KEY;
  const id = getText(formData, "id");
  const nextStatus = getText(formData, "status");

  if (!adminKey || getText(formData, "adminKey") !== adminKey) {
    throw new Error("Admin key salah.");
  }

  if (!id || !validStatuses.has(nextStatus)) {
    throw new Error("Data request tidak valid.");
  }

  await prisma.downloadRequest.update({
    data: {
      status: nextStatus as DownloadRequestStatus,
    },
    where: { id },
  });

  revalidatePath("/admin/requests");
}
