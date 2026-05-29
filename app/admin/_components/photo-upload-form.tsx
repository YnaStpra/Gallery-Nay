"use client";

import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";

import {
  initialAdminActionState,
  uploadPhoto,
} from "@/app/admin/actions";

type PhotoUploadFormProps = {
  isConfigured: boolean;
  missingConfig: string[];
};

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-200">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "min-h-11 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

export function PhotoUploadForm({
  isConfigured,
  missingConfig,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    uploadPhoto,
    initialAdminActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-5 rounded-lg border border-white/10 bg-zinc-950 p-5"
    >
      {!isConfigured ? (
        <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Upload belum aktif. Lengkapi env: {missingConfig.join(", ")}.
        </div>
      ) : null}

      {state.message ? (
        <div
          className={`rounded-md border p-4 text-sm ${
            state.status === "success"
              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
              : "border-red-300/20 bg-red-300/10 text-red-100"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Admin key">
          <input
            className={inputClassName}
            name="adminKey"
            placeholder="Masukkan ADMIN_UPLOAD_KEY"
            required
            type="password"
          />
        </Field>

        <Field label="Foto">
          <input
            accept="image/avif,image/jpeg,image/png,image/webp"
            className={`${inputClassName} file:mr-3 file:rounded file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black`}
            name="image"
            required
            type="file"
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Judul">
          <input
            className={inputClassName}
            maxLength={120}
            name="title"
            placeholder="Contoh: Sunset di Losari"
            required
          />
        </Field>

        <Field label="Collection">
          <input
            className={inputClassName}
            maxLength={80}
            name="collection"
            placeholder="Contoh: Sulawesi Field Notes"
          />
        </Field>
      </div>

      <Field label="Cerita / deskripsi">
        <textarea
          className={`${inputClassName} min-h-28 resize-y`}
          maxLength={500}
          name="description"
          placeholder="Tulis konteks singkat tentang foto ini."
        />
      </Field>

      <Field label="Alt text">
        <input
          className={inputClassName}
          maxLength={180}
          name="altText"
          placeholder="Deskripsi visual singkat untuk aksesibilitas."
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Lokasi">
          <input
            className={inputClassName}
            maxLength={100}
            name="location"
            placeholder="Makassar, Sulawesi Selatan"
          />
        </Field>

        <Field label="Negara">
          <input
            className={inputClassName}
            maxLength={80}
            name="country"
            placeholder="Indonesia"
          />
        </Field>

        <Field label="Tanggal foto">
          <input className={inputClassName} name="takenAt" type="date" />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Kamera">
          <input
            className={inputClassName}
            maxLength={80}
            name="camera"
            placeholder="Sony A7 IV"
          />
        </Field>

        <Field label="Lensa">
          <input
            className={inputClassName}
            maxLength={100}
            name="lens"
            placeholder="FE 24-70mm f/2.8"
          />
        </Field>

        <Field label="Focal length">
          <input
            className={inputClassName}
            maxLength={40}
            name="focalLength"
            placeholder="35mm"
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Field label="Aperture">
          <input
            className={inputClassName}
            maxLength={30}
            name="aperture"
            placeholder="f/5.6"
          />
        </Field>

        <Field label="Shutter speed">
          <input
            className={inputClassName}
            maxLength={30}
            name="shutterSpeed"
            placeholder="1/640"
          />
        </Field>

        <Field label="ISO">
          <input
            className={inputClassName}
            min={1}
            name="iso"
            placeholder="100"
            type="number"
          />
        </Field>

        <Field label="Dominant color">
          <input
            className="h-11 w-full rounded-md border border-white/10 bg-black p-1"
            defaultValue="#64748b"
            name="dominantColor"
            type="color"
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Color profile">
          <input
            className={inputClassName}
            maxLength={40}
            name="colorProfile"
            placeholder="sRGB"
          />
        </Field>

        <Field label="Copyright">
          <input
            className={inputClassName}
            maxLength={100}
            name="copyright"
            placeholder="(c) Yan Saputra"
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          className="size-4 rounded border-white/20 bg-black"
          defaultChecked
          name="published"
          type="checkbox"
        />
        Tampilkan di homepage setelah upload
      </label>

      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!isConfigured || pending}
        type="submit"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <UploadCloud className="size-4" aria-hidden />
        )}
        {pending ? "Uploading..." : "Upload foto"}
      </button>
    </form>
  );
}
