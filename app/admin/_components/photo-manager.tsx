"use client";

import {
  Eye,
  EyeOff,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useActionState, useState } from "react";

import { ProtectedPhoto } from "@/app/_components/protected-photo";
import {
  deletePhoto,
  updatePhoto,
} from "@/app/admin/actions";
import type { AdminActionState } from "@/app/admin/actions";

export type ManagedPhoto = {
  altText: string;
  aperture: string;
  camera: string;
  collection: string;
  colorProfile: string;
  copyright: string;
  country: string;
  createdAt: string;
  description: string;
  dominantColor: string;
  focalLength: string;
  id: string;
  imageUrl: string;
  iso: string;
  lens: string;
  location: string;
  published: boolean;
  shutterSpeed: string;
  takenAt: string;
  title: string;
};

type PhotoManagerProps = {
  collections: string[];
  photos: ManagedPhoto[];
};

const inputClassName =
  "min-h-10 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PhotoManagementCard({
  adminKey,
  collections,
  photo,
}: {
  adminKey: string;
  collections: string[];
  photo: ManagedPhoto;
}) {
  const [updateState, updateAction, updatePending] = useActionState(
    updatePhoto,
    initialAdminActionState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deletePhoto,
    initialAdminActionState,
  );
  const collectionListId = `collections-${photo.id}`;

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[190px_1fr]">
        <div className="relative border-b border-white/10 bg-black p-3 lg:border-b-0 lg:border-r">
          <ProtectedPhoto
            alt={photo.altText || photo.title}
            className="h-40 rounded-md lg:h-44"
            src={photo.imageUrl}
            sizes="(min-width: 1024px) 190px, 100vw"
          />
          <span
            className={`absolute left-5 top-5 z-30 inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
              photo.published
                ? "bg-emerald-300/90 text-black"
                : "bg-zinc-900/85 text-zinc-200"
            }`}
          >
            {photo.published ? (
              <Eye className="size-3" aria-hidden />
            ) : (
              <EyeOff className="size-3" aria-hidden />
            )}
            {photo.published ? "Live" : "Draft"}
          </span>
        </div>

        <div className="grid gap-5 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {photo.collection || "No category"}
              </p>
              <h3 className="mt-2 truncate text-xl font-semibold text-white">
                {photo.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Uploaded {photo.createdAt}
              </p>
            </div>
            <span
              className="size-4 shrink-0 rounded-sm"
              style={{ backgroundColor: photo.dominantColor || "#64748b" }}
              aria-label={`Dominant color ${photo.dominantColor}`}
            />
          </div>

          {updateState.message ? (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${
                updateState.status === "success"
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                  : "border-red-300/20 bg-red-300/10 text-red-100"
              }`}
            >
              {updateState.message}
            </p>
          ) : null}

          {deleteState.message ? (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${
                deleteState.status === "success"
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                  : "border-red-300/20 bg-red-300/10 text-red-100"
              }`}
            >
              {deleteState.message}
            </p>
          ) : null}

          <form action={updateAction} className="grid gap-4">
            <input name="adminKey" type="hidden" value={adminKey} />
            <input name="id" type="hidden" value={photo.id} />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Judul">
                <input
                  className={inputClassName}
                  defaultValue={photo.title}
                  name="title"
                  required
                />
              </Field>

              <Field label="Kategori / collection">
                <input
                  className={inputClassName}
                  defaultValue={photo.collection}
                  list={collectionListId}
                  name="collection"
                  placeholder="Contoh: Travel, Wedding, Street"
                />
                <datalist id={collectionListId}>
                  {collections.map((collection) => (
                    <option key={collection} value={collection} />
                  ))}
                </datalist>
              </Field>
            </div>

            <Field label="Deskripsi">
              <textarea
                className={`${inputClassName} min-h-24 resize-y normal-case tracking-normal text-zinc-100`}
                defaultValue={photo.description}
                name="description"
              />
            </Field>

            <Field label="Alt text">
              <input
                className={inputClassName}
                defaultValue={photo.altText}
                name="altText"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Lokasi">
                <input
                  className={inputClassName}
                  defaultValue={photo.location}
                  name="location"
                />
              </Field>

              <Field label="Negara">
                <input
                  className={inputClassName}
                  defaultValue={photo.country}
                  name="country"
                />
              </Field>

              <Field label="Tanggal">
                <input
                  className={inputClassName}
                  defaultValue={photo.takenAt}
                  name="takenAt"
                  type="date"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Kamera">
                <input
                  className={inputClassName}
                  defaultValue={photo.camera}
                  name="camera"
                />
              </Field>

              <Field label="Lensa">
                <input
                  className={inputClassName}
                  defaultValue={photo.lens}
                  name="lens"
                />
              </Field>

              <Field label="Focal length">
                <input
                  className={inputClassName}
                  defaultValue={photo.focalLength}
                  name="focalLength"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Aperture">
                <input
                  className={inputClassName}
                  defaultValue={photo.aperture}
                  name="aperture"
                />
              </Field>

              <Field label="Shutter">
                <input
                  className={inputClassName}
                  defaultValue={photo.shutterSpeed}
                  name="shutterSpeed"
                />
              </Field>

              <Field label="ISO">
                <input
                  className={inputClassName}
                  defaultValue={photo.iso}
                  min={1}
                  name="iso"
                  type="number"
                />
              </Field>

              <Field label="Warna">
                <input
                  className="h-10 w-full rounded-md border border-white/10 bg-black p-1"
                  defaultValue={photo.dominantColor || "#64748b"}
                  name="dominantColor"
                  type="color"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Color profile">
                <input
                  className={inputClassName}
                  defaultValue={photo.colorProfile}
                  name="colorProfile"
                />
              </Field>

              <Field label="Copyright">
                <input
                  className={inputClassName}
                  defaultValue={photo.copyright}
                  name="copyright"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input
                  className="size-4 rounded border-white/20 bg-black"
                  defaultChecked={photo.published}
                  name="published"
                  type="checkbox"
                />
                Tampilkan di homepage
              </label>

              <button
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!adminKey || updatePending}
                type="submit"
              >
                {updatePending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                Simpan perubahan
              </button>
            </div>
          </form>

          <form
            action={deleteAction}
            className="border-t border-red-300/10 pt-4"
          >
            <input name="adminKey" type="hidden" value={adminKey} />
            <input name="id" type="hidden" value={photo.id} />
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300/20 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!adminKey || deletePending}
              onClick={(event) => {
                if (!window.confirm(`Hapus "${photo.title}"?`)) {
                  event.preventDefault();
                }
              }}
              type="submit"
            >
              {deletePending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
              Hapus foto
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export function PhotoManager({ collections, photos }: PhotoManagerProps) {
  const [adminKey, setAdminKey] = useState("");

  return (
    <section className="grid gap-5">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-zinc-950 p-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
            Manage Photos
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Kelola foto yang sudah diupload
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Edit metadata, pindahkan kategori melalui field collection,
            publish/draft, atau hapus foto dari database.
          </p>
        </div>

        <label className="grid min-w-full gap-2 text-sm font-medium text-zinc-200 lg:min-w-[320px]">
          <span>Admin key untuk edit/hapus</span>
          <input
            className={inputClassName}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="Masukkan ADMIN_UPLOAD_KEY"
            type="password"
            value={adminKey}
          />
        </label>
      </div>

      {photos.length > 0 ? (
        <div className="grid gap-5">
          {photos.map((photo) => (
            <PhotoManagementCard
              adminKey={adminKey}
              collections={collections}
              key={photo.id}
              photo={photo}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-zinc-500">
          Belum ada foto di database.
        </p>
      )}
    </section>
  );
}
