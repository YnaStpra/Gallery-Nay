"use client";

import { Loader2, RefreshCw, UploadCloud } from "lucide-react";
import { useActionState } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { uploadPhoto } from "@/app/admin/actions";
import {
  extractPhotoMetadata,
  generateTitleFromFilename,
  slugify,
} from "@/src/lib/photo-auto-fill";
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts";
import { DraftRecoveryDialog } from "./DraftRecoveryDialog";
import { KeyboardShortcutOverlay } from "./KeyboardShortcutOverlay";
import { UploadProgress } from "./UploadProgress";
import { UploadPreview } from "./UploadPreview";
import { MetadataSections } from "./MetadataSections";

const STORAGE_KEY = "gallery-photo-admin-upload-draft-v1";

type UploadSuggestions = {
  collections: string[];
  cameras: string[];
  lenses: string[];
  countries: string[];
  software: string[];
  cameraProfiles: string[];
  copyrights: string[];
  locations: string[];
  tags: string[];
  photographerNotes: string[];
};

type UploadDefaults = {
  collection?: string;
  country?: string;
  camera?: string;
  cameraProfile?: string;
  editingSoftware?: string;
  copyright?: string;
};

type UploadWorkspaceProps = {
  isConfigured: boolean;
  missingConfig: string[];
  suggestions: UploadSuggestions;
  defaults: UploadDefaults;
};

type UploadFormState = {
  allowDownload: boolean;
  cameraProfile: string;
  photographerNotes: string;
  title: string;
  slug: string;
  description: string;
  shootingConditions: string;
  shootingChallenges: string;
  waitingTime: string;
  interestingFacts: string;
  behindTheShot: string;
  altText: string;
  location: string;
  country: string;
  takenAt: string;
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  dominantColor: string;
  colorProfile: string;
  copyright: string;
  collection: string;
  editingSoftware: string;
  lutDescription: string;
  lutFileName: string;
  lutFormat: string;
  lutName: string;
  lutVersion: string;
  originalFileName: string;
  metadataJson: string;
  tags: string;
  isPremium: boolean;
};

const emptyFormState: UploadFormState = {
  allowDownload: false,
  cameraProfile: "",
  photographerNotes: "",
  title: "",
  slug: "",
  description: "",
  shootingConditions: "",
  shootingChallenges: "",
  waitingTime: "",
  interestingFacts: "",
  behindTheShot: "",
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
  lutDescription: "",
  lutFileName: "",
  lutFormat: "",
  lutName: "",
  lutVersion: "",
  originalFileName: "",
  metadataJson: "",
  tags: "",
  isPremium: false,
};

type UploadStage =
  | "idle"
  | "extract"
  | "preview"
  | "palette"
  | "histogram"
  | "upload"
  | "save"
  | "complete"
  | "error";

export function UploadWorkspace({
  isConfigured,
  missingConfig,
  suggestions,
  defaults,
}: UploadWorkspaceProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(uploadPhoto, {
    message: "",
    status: "idle" as const,
  });
  const [form, setForm] = useState<UploadFormState>(() => ({
    ...emptyFormState,
    camera: defaults.camera ?? "",
    country: defaults.country ?? "",
    collection: defaults.collection ?? "",
    cameraProfile: defaults.cameraProfile ?? "",
    editingSoftware: defaults.editingSoftware ?? "",
    copyright: defaults.copyright ?? "",
  }));
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedPresetName, setSelectedPresetName] = useState("");
  const [selectedOriginalName, setSelectedOriginalName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadataStatus, setMetadataStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [metadataMessage, setMetadataMessage] = useState(
    "Select an image to load metadata.",
  );
  const [draftPromptOpen, setDraftPromptOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftName, setDraftName] = useState("Previous upload draft");
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progressMessage, setProgressMessage] = useState("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);
  const [isAltTextEdited, setIsAltTextEdited] = useState(false);
  const [isLocationEdited, setIsLocationEdited] = useState(false);
  const [isCountryEdited, setIsCountryEdited] = useState(false);

  const previewMetadata = useMemo(
    () => ({
      title: form.title,
      camera: form.camera,
      lens: form.lens,
      location: form.location,
      country: form.country,
      collection: form.collection,
      cameraProfile: form.cameraProfile,
      editingSoftware: form.editingSoftware,
      focalLength: form.focalLength,
      aperture: form.aperture,
      shutterSpeed: form.shutterSpeed,
      iso: form.iso,
      takenAt: form.takenAt,
      dominantColor: form.dominantColor,
    }),
    [form],
  );

  const progressStatus = useMemo(() => {
    if (state.status === "success") return "complete" as const;
    if (state.status === "error") return "error" as const;
    if (pending) return "active" as const;
    return stage === "idle" ? "idle" : "active";
  }, [pending, state.status, stage]);

  useKeyboardShortcuts([
    {
      id: "save-draft",
      keys: [
        { key: "s", ctrl: true },
        { key: "s", meta: true },
      ],
      handler: () => {
        saveDraft();
      },
    },
    {
      id: "publish",
      keys: [
        { key: "Enter", ctrl: true },
        { key: "Enter", meta: true },
      ],
      handler: () => {
        formRef.current?.requestSubmit();
      },
    },
    {
      id: "cancel-upload",
      keys: [{ key: "Escape" }],
      handler: () => {
        handleCancel();
      },
    },
    {
      id: "focus-title",
      keys: [
        { key: "t", ctrl: true },
        { key: "t", meta: true },
      ],
      handler: () => focusField("title"),
    },
    {
      id: "focus-tags",
      keys: [
        { key: "n", ctrl: true },
        { key: "n", meta: true },
      ],
      handler: () => focusField("tags"),
    },
    {
      id: "focus-notes",
      keys: [
        { key: "p", ctrl: true },
        { key: "p", meta: true },
      ],
      handler: () => focusField("photographerNotes"),
    },
    {
      id: "show-shortcuts",
      keys: [{ key: "?", shift: true }, { key: "/" }],
      handler: () => setShortcutsOpen(true),
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const draft = JSON.parse(stored) as {
        form: UploadFormState;
        selectedFileName?: string;
        selectedPresetName?: string;
        selectedOriginalName?: string;
        savedAt?: string;
      };

      if (draft && draft.form && typeof draft.form === "object") {
        setHasDraft(true);
        setDraftName(
          draft.selectedFileName || draft.form.title || "Previous upload draft",
        );
        setDraftPromptOpen(true);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (pending) {
      setStage("upload");
      setProgressMessage("Uploading image and saving metadata...");
      return;
    }

    if (state.status === "success") {
      setStage("complete");
      setProgressMessage(state.message || "Upload completed successfully.");
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    if (state.status === "error") {
      setStage("error");
      setProgressMessage(state.message || "Upload failed.");
      return;
    }
  }, [pending, state.message, state.status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraft();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [form, selectedFileName, selectedPresetName, selectedOriginalName]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const saveDraft = () => {
    if (typeof window === "undefined") return;
    const payload = {
      form,
      selectedFileName,
      selectedPresetName,
      selectedOriginalName,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setHasDraft(true);
  };

  const restoreDraft = () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const draft = JSON.parse(stored) as {
        form: UploadFormState;
        selectedFileName?: string;
        selectedPresetName?: string;
        selectedOriginalName?: string;
      };
      setForm({ ...emptyFormState, ...draft.form });
      setSelectedFileName(draft.selectedFileName ?? "");
      setSelectedPresetName(draft.selectedPresetName ?? "");
      setSelectedOriginalName(draft.selectedOriginalName ?? "");
      setMetadataStatus("idle");
      setMetadataMessage("Draft restored. Re-select the photo to continue.");
      setDraftPromptOpen(false);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setDraftPromptOpen(false);
    }
  };

  const discardDraft = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
    setHasDraft(false);
    setDraftPromptOpen(false);
  };

  const resetForm = () => {
    setForm({
      ...emptyFormState,
      camera: defaults.camera ?? "",
      country: defaults.country ?? "",
      collection: defaults.collection ?? "",
      cameraProfile: defaults.cameraProfile ?? "",
      editingSoftware: defaults.editingSoftware ?? "",
      copyright: defaults.copyright ?? "",
    });
    setSelectedFileName("");
    setSelectedPresetName("");
    setSelectedOriginalName("");
    setPreviewUrl(null);
    setMetadataStatus("idle");
    setMetadataMessage("Select an image to load metadata.");
    setStage("idle");
    setProgressMessage("");
    setIsTitleEdited(false);
    setIsSlugEdited(false);
    setIsDescriptionEdited(false);
    setIsAltTextEdited(false);
    setIsLocationEdited(false);
    setIsCountryEdited(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const focusField = (name: string) => {
    const field = formRef.current?.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[name="${name}"]`);
    field?.focus();
  };

  const updateField = (
    name: keyof UploadFormState,
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

  const applyMetadata = async (file: File) => {
    try {
      setMetadataStatus("loading");
      setMetadataMessage("Extracting EXIF metadata...");
      setStage("extract");

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
        next.metadataJson = draft.metadata
          ? JSON.stringify(draft.metadata)
          : next.metadataJson;

        return next;
      });

      setMetadataStatus("ready");
      setMetadataMessage("Metadata successfully loaded.");
      setStage("preview");
      setProgressMessage("Metadata extracted. Preview ready.");
    } catch (error) {
      console.error("Failed to read metadata", error);
      setMetadataStatus("error");
      setMetadataMessage("Unable to extract metadata from the selected image.");
      setStage("error");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setSelectedFileName(file.name);
    setStage("extract");
    setMetadataMessage("Preparing live preview and metadata...");

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

  const handleCancel = () => {
    resetForm();
    setProgressMessage("Upload cancelled. Select a photo to start again.");
  };

  const isSubmitDisabled =
    !isConfigured || !selectedFileName || !form.title || !form.collection;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <DraftRecoveryDialog
        open={draftPromptOpen}
        draftName={draftName}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
        onClose={() => setDraftPromptOpen(false)}
      />
      <KeyboardShortcutOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <div className="space-y-5">
        <UploadPreview
          imageUrl={previewUrl}
          previewName={selectedFileName}
          metadata={previewMetadata}
          onDetailsReady={({ width, height, aspectRatio, dominantColor }) => {
            setStage("palette");
            setProgressMessage(
              "Preview ready. Generating palette and histogram...",
            );
            setForm((current) => ({ ...current, dominantColor }));
          }}
        />
        <UploadProgress
          stage={stage}
          status={progressStatus}
          message={progressMessage}
        />
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="space-y-5 rounded-[32px] border border-white/10 bg-zinc-950/60 p-5 shadow-xl shadow-black/20 backdrop-blur-sm"
      >
        {!isConfigured ? (
          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            Upload belum aktif. Lengkapi env: {missingConfig.join(", ")}.
          </div>
        ) : null}

        {state.message ? (
          <div
            className={`rounded-3xl border p-4 text-sm ${
              state.status === "success"
                ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                : state.status === "error"
                  ? "border-red-300/20 bg-red-300/10 text-red-100"
                  : "border-white/10 bg-white/5 text-zinc-100"
            }`}
            role="status"
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              <span>Admin key</span>
              <input
                className="min-h-11 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20"
                name="adminKey"
                placeholder="Masukkan ADMIN_UPLOAD_KEY"
                required
                type="password"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              <span>Foto</span>
              <input
                accept="image/avif,image/jpeg,image/png,image/webp"
                className="min-h-11 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
                name="image"
                onChange={handleFileChange}
                ref={fileInputRef}
                required
                type="file"
              />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              <span>Preset file</span>
              <input
                accept=".cube,.xmp,.dng,.3dl,.look,.icc,.icm"
                className="min-h-11 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none file:mr-3 file:rounded-full file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
                name="preset"
                onChange={handlePresetChange}
                type="file"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              <span>Original image (optional)</span>
              <input
                accept="image/jpeg,image/jpg,image/png,image/tiff"
                className="min-h-11 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none file:mr-3 file:rounded-full file:border-0 file:bg-amber-200 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
                name="originalImage"
                onChange={handleOriginalChange}
                type="file"
              />
            </label>
          </div>
        </div>

        <input name="metadata" type="hidden" value={form.metadataJson} />
        <input name="tags" type="hidden" value={form.tags} />
        <input name="published" type="hidden" value="on" />

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-5">
          <div className="grid gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                Upload hints
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Smart defaults and autosave
              </h3>
            </div>
            <p className="text-sm text-zinc-400">
              Fields are prefilled from your most recent uploads. Drafts save
              automatically and can be restored when you reopen this page.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Default camera
                </p>
                <p className="mt-2 text-sm text-white">
                  {defaults.camera || "Not set"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Default collection
                </p>
                <p className="mt-2 text-sm text-white">
                  {defaults.collection || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MetadataSections
          form={form}
          suggestions={suggestions}
          updateField={updateField}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-300">
            <input
              className="size-4 rounded border-white/20 bg-black"
              checked={form.allowDownload}
              name="allowDownload"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  allowDownload: event.target.checked,
                }))
              }
              type="checkbox"
            />
            Allow download
          </label>
          <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-300">
            <input
              className="size-4 rounded border-white/20 bg-black"
              checked={form.isPremium}
              name="isPremium"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isPremium: event.target.checked,
                }))
              }
              type="checkbox"
            />
            Premium preset
          </label>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Metadata status
              </p>
              <p className="text-sm text-zinc-400">{metadataMessage}</p>
            </div>
            <button
              type="button"
              disabled={!selectedFileName || metadataStatus === "loading"}
              onClick={() => {
                const file = fileInputRef.current?.files?.[0];
                if (file) void applyMetadata(file);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="size-4" /> Re-scan metadata
            </button>
          </div>
          {selectedFileName ? (
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
              Selected file: {selectedFileName}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cancel upload
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled || pending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <UploadCloud className="size-4" aria-hidden />
            )}
            {pending ? "Publishing..." : "Publish photo"}
          </button>
        </div>
      </form>
    </div>
  );
}
