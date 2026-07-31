"use client";

import { Loader2, RefreshCw, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { uploadPhoto } from "@/app/admin/actions";
import type { AdminActionState } from "@/app/admin/actions";
import {
  extractPhotoMetadata,
  generateTitleFromFilename,
  slugify,
} from "@/src/lib/photo-auto-fill";

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

const initialAdminActionState: AdminActionState = {
  message: "",
  status: "idle",
};

const emptyFormState = {
  allowDownload: false,
  cameraProfile: "",
  photographerNotes: "",
  title: "",
  slug: "",
  description: "",
  altText: "",
  location: "",
  country: "",
  takenAt: "",
  camera: "",
  lens: "",
  focalLength: "",
  aperture: "",
  shutterSpeed: "",
  iso: "",
  dominantColor: "#64748b",
  colorProfile: "",
  copyright: "",
  collection: "",
  editingSoftware: "",
  isPremium: false,
  lutDescription: "",
  lutFileName: "",
  lutFormat: "",
  lutName: "",
  lutVersion: "",
  originalFileName: "",
};

export function PhotoUploadForm({
  isConfigured,
  missingConfig,
}: PhotoUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(
    uploadPhoto,
    initialAdminActionState,
  );
  const [form, setForm] = useState(emptyFormState);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [metadataStatus, setMetadataStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [metadataMessage, setMetadataMessage] = useState("");
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);
  const [isAltTextEdited, setIsAltTextEdited] = useState(false);
  const [isLocationEdited, setIsLocationEdited] = useState(false);
  const [isCountryEdited, setIsCountryEdited] = useState(false);
  const [selectedPresetName, setSelectedPresetName] = useState("");
  const [selectedOriginalName, setSelectedOriginalName] = useState("");

  const resetFormState = () => {
    setForm(emptyFormState);
    setSelectedFileName("");
    setMetadataStatus("idle");
    setMetadataMessage("");
    setIsTitleEdited(false);
    setIsSlugEdited(false);
    setIsDescriptionEdited(false);
    setIsAltTextEdited(false);
    setIsLocationEdited(false);
    setIsCountryEdited(false);
    setSelectedPresetName("");
    setSelectedOriginalName("");
  };

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      window.setTimeout(() => {
        resetFormState();
      }, 0);

      router.refresh();
    }
  }, [router, state.status]);

  const updateField = (
    name: keyof typeof emptyFormState,
    value: string,
    markEdited = false,
  ) => {
    setForm((current) => ({ ...current, [name]: value }));

    if (name === "title" && markEdited) setIsTitleEdited(true);
    if (name === "slug" && markEdited) setIsSlugEdited(true);
    if (name === "description" && markEdited) setIsDescriptionEdited(true);
    if (name === "altText" && markEdited) setIsAltTextEdited(true);
    if (name === "location" && markEdited) setIsLocationEdited(true);
    if (name === "country" && markEdited) setIsCountryEdited(true);
  };

  const popup = pending
    ? {
        kind: "loading" as const,
        message: state.message || "Upload sedang di proses",
      }
    : state.status === "success"
      ? {
          kind: "success" as const,
          message: state.message || "Upload berhasil",
        }
      : state.status === "error"
        ? {
            kind: "error" as const,
            message: state.message || "Upload gagal",
          }
        : null;

  const applyMetadata = async (file: File) => {
    try {
      setMetadataStatus("loading");
      setMetadataMessage("Reading metadata...");

      const draft = await extractPhotoMetadata(file);

      setForm((current) => {
        const next = { ...current };

        if (!isTitleEdited && draft.title) {
          next.title = draft.title;
          if (!isSlugEdited) {
            next.slug = slugify(draft.title);
          }
        }

        if (!isDescriptionEdited && draft.description) {
          next.description = draft.description;
        }

        if (!isAltTextEdited && draft.altText) {
          next.altText = draft.altText;
        }

        if (!isLocationEdited && draft.location) {
          next.location = draft.location;
        }

        if (!isCountryEdited && draft.country) {
          next.country = draft.country;
        }

        next.camera = draft.camera ?? next.camera;
        next.lens = draft.lens ?? next.lens;
        next.focalLength = draft.focalLength ?? next.focalLength;
        next.aperture = draft.aperture ?? next.aperture;
        next.shutterSpeed = draft.shutterSpeed ?? next.shutterSpeed;
        next.iso = draft.iso ?? next.iso;
        next.takenAt = draft.takenAt ?? next.takenAt;
        next.dominantColor = draft.dominantColor ?? next.dominantColor;

        return next;
      });

      setMetadataStatus("ready");
      setMetadataMessage("Metadata loaded.");
    } catch (error) {
      console.error("Failed to read metadata", error);
      setMetadataStatus("error");
      setMetadataMessage("Metadata could not be read.");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    setForm((current) => {
      if (isTitleEdited) return current;
      const nextTitle = generateTitleFromFilename(file.name);
      return {
        ...current,
        title: nextTitle,
        slug: isSlugEdited ? current.slug : slugify(nextTitle),
      };
    });

    await applyMetadata(file);
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedPresetName(file?.name ?? "");
    setForm((current) => ({
      ...current,
      lutFileName: file?.name ?? "",
      lutFormat: file ? (file.name.split(".").pop()?.toUpperCase() ?? "") : "",
    }));
  };

  const handleOriginalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedOriginalName(file?.name ?? "");
    setForm((current) => ({
      ...current,
      originalFileName: file?.name ?? "",
    }));
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-5 rounded-lg border border-white/10 bg-zinc-950 p-5"
    >
      {popup ? (
        <div
          className={`fixed right-4 top-4 z-[120] min-w-[240px] rounded-2xl border px-4 py-3 text-sm shadow-2xl shadow-black/30 backdrop-blur-xl ${
            popup.kind === "loading"
              ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-50"
              : popup.kind === "success"
                ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-50"
                : "border-red-300/20 bg-red-300/10 text-red-50"
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold">
            {popup.kind === "loading"
              ? "Upload sedang di proses"
              : popup.kind === "success"
                ? "Upload berhasil"
                : "Upload gagal"}
          </p>
          {popup.kind === "loading" && state.message ? (
            <p className="mt-1 text-xs text-cyan-100/90">{state.message}</p>
          ) : null}
          {popup.kind !== "loading" && state.message ? (
            <p className="mt-1 text-xs opacity-90">{state.message}</p>
          ) : null}
        </div>
      ) : null}

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
            onChange={handleFileChange}
            ref={fileInputRef}
            required
            type="file"
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
            Editing Preset
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Upload Preset / LUT
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Supported: .cube, .xmp, .dng, .3dl, .look, .icc, .icm
          </p>
        </div>
        <Field label="Preset file">
          <input
            accept=".cube,.xmp,.dng,.3dl,.look,.icc,.icm"
            className={`${inputClassName} file:mr-3 file:rounded file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black`}
            name="preset"
            onChange={handlePresetChange}
            type="file"
          />
        </Field>
        <Field label="Original Image (Optional)">
          <input
            accept="image/jpeg,image/jpg,image/png,image/tiff"
            className={`${inputClassName} file:mr-3 file:rounded file:border-0 file:bg-amber-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black`}
            name="originalImage"
            onChange={handleOriginalChange}
            type="file"
          />
        </Field>
        {selectedOriginalName ? (
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Selected original: {selectedOriginalName}
          </p>
        ) : null}
        {selectedPresetName ? (
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Selected preset: {selectedPresetName}
          </p>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Preset Name">
            <input
              className={inputClassName}
              maxLength={120}
              name="lutName"
              placeholder="Moody Forest v2"
              value={form.lutName}
              onChange={(event) => updateField("lutName", event.target.value)}
            />
          </Field>
          <Field label="Preset Version">
            <input
              className={inputClassName}
              maxLength={40}
              name="lutVersion"
              placeholder="2.1"
              value={form.lutVersion}
              onChange={(event) =>
                updateField("lutVersion", event.target.value)
              }
            />
          </Field>
          <Field label="Editing Software">
            <input
              className={inputClassName}
              maxLength={80}
              name="editingSoftware"
              placeholder="Adobe Lightroom Classic"
              value={form.editingSoftware}
              onChange={(event) =>
                updateField("editingSoftware", event.target.value)
              }
            />
          </Field>
          <Field label="Camera Profile">
            <input
              className={inputClassName}
              maxLength={80}
              name="cameraProfile"
              placeholder="Adobe Landscape"
              value={form.cameraProfile}
              onChange={(event) =>
                updateField("cameraProfile", event.target.value)
              }
            />
          </Field>
        </div>
        <Field label="Preset Description">
          <textarea
            className={`${inputClassName} min-h-24 resize-y`}
            maxLength={500}
            name="lutDescription"
            placeholder="Soft contrast with warm cinematic tones."
            value={form.lutDescription}
            onChange={(event) =>
              updateField("lutDescription", event.target.value)
            }
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              className="size-4 rounded border-white/20 bg-black"
              name="allowDownload"
              type="checkbox"
            />
            Allow Download
          </label>
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              className="size-4 rounded border-white/20 bg-black"
              name="isPremium"
              type="checkbox"
            />
            Premium Preset
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Judul">
          <input
            className={inputClassName}
            maxLength={120}
            name="title"
            placeholder="Contoh: Sunset di Losari"
            required
            value={form.title}
            onChange={(event) => {
              updateField("title", event.target.value, true);
              if (!isSlugEdited) {
                updateField("slug", slugify(event.target.value));
              }
            }}
          />
        </Field>

        <Field label="Slug">
          <input
            className={inputClassName}
            maxLength={140}
            name="slug"
            placeholder="Akan dibuat otomatis dari judul"
            value={form.slug}
            onChange={(event) => updateField("slug", event.target.value, true)}
          />
        </Field>

        <Field label="Collection">
          <input
            className={inputClassName}
            maxLength={80}
            name="collection"
            placeholder="Contoh: Sulawesi Field Notes"
            value={form.collection}
            onChange={(event) => updateField("collection", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Cerita / deskripsi">
        <textarea
          className={`${inputClassName} min-h-28 resize-y`}
          maxLength={500}
          name="description"
          placeholder="Tulis konteks singkat tentang foto ini."
          value={form.description}
          onChange={(event) =>
            updateField("description", event.target.value, true)
          }
        />
      </Field>

      <Field label="Photographer Notes">
        <textarea
          className={`${inputClassName} min-h-32 resize-y`}
          maxLength={5000}
          name="photographerNotes"
          placeholder="Describe the story, technical decisions, or creative process behind this photograph..."
          value={form.photographerNotes}
          onChange={(event) =>
            updateField("photographerNotes", event.target.value, true)
          }
        />
        <p className="text-xs text-zinc-500">
          Optional. Recommended length: 200–1000 characters.
        </p>
      </Field>

      <Field label="Alt text">
        <input
          className={inputClassName}
          maxLength={180}
          name="altText"
          placeholder="Deskripsi visual singkat untuk aksesibilitas."
          value={form.altText}
          onChange={(event) => updateField("altText", event.target.value, true)}
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Lokasi">
          <input
            className={inputClassName}
            maxLength={100}
            name="location"
            placeholder="Makassar, Sulawesi Selatan"
            value={form.location}
            onChange={(event) =>
              updateField("location", event.target.value, true)
            }
          />
        </Field>

        <Field label="Negara">
          <input
            className={inputClassName}
            maxLength={80}
            name="country"
            placeholder="Indonesia"
            value={form.country}
            onChange={(event) =>
              updateField("country", event.target.value, true)
            }
          />
        </Field>

        <Field label="Tanggal foto">
          <input
            className={inputClassName}
            name="takenAt"
            type="date"
            value={form.takenAt}
            onChange={(event) => updateField("takenAt", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Kamera">
          <input
            className={inputClassName}
            maxLength={80}
            name="camera"
            placeholder="Sony A7 IV"
            value={form.camera}
            onChange={(event) => updateField("camera", event.target.value)}
          />
        </Field>

        <Field label="Lensa">
          <input
            className={inputClassName}
            maxLength={100}
            name="lens"
            placeholder="FE 24-70mm f/2.8"
            value={form.lens}
            onChange={(event) => updateField("lens", event.target.value)}
          />
        </Field>

        <Field label="Focal length">
          <input
            className={inputClassName}
            maxLength={40}
            name="focalLength"
            placeholder="35mm"
            value={form.focalLength}
            onChange={(event) => updateField("focalLength", event.target.value)}
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
            value={form.aperture}
            onChange={(event) => updateField("aperture", event.target.value)}
          />
        </Field>

        <Field label="Shutter speed">
          <input
            className={inputClassName}
            maxLength={30}
            name="shutterSpeed"
            placeholder="1/640"
            value={form.shutterSpeed}
            onChange={(event) =>
              updateField("shutterSpeed", event.target.value)
            }
          />
        </Field>

        <Field label="ISO">
          <input
            className={inputClassName}
            min={1}
            name="iso"
            placeholder="100"
            type="number"
            value={form.iso}
            onChange={(event) => updateField("iso", event.target.value)}
          />
        </Field>

        <Field label="Dominant color">
          <input
            className="h-11 w-full rounded-md border border-white/10 bg-black p-1"
            name="dominantColor"
            type="color"
            value={form.dominantColor}
            onChange={(event) =>
              updateField("dominantColor", event.target.value)
            }
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
            value={form.colorProfile}
            onChange={(event) =>
              updateField("colorProfile", event.target.value)
            }
          />
        </Field>

        <Field label="Copyright">
          <input
            className={inputClassName}
            maxLength={100}
            name="copyright"
            placeholder="(c) Yan Saputra"
            value={form.copyright}
            onChange={(event) => updateField("copyright", event.target.value)}
          />
        </Field>
      </div>

      <div className="rounded-md border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-white">Auto-fill status</p>
            <p className="mt-1 text-zinc-400">
              {metadataMessage || "Select an image to read metadata."}
            </p>
            {selectedFileName ? (
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                Selected file: {selectedFileName}
              </p>
            ) : null}
          </div>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={!selectedFileName || metadataStatus === "loading"}
            onClick={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) {
                void applyMetadata(file);
              }
            }}
          >
            <RefreshCw className="size-4" />
            Re-scan Metadata
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Manual edits are preserved after the field has been changed.
        </p>
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
