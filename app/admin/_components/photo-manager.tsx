"use client";

import {
  Camera,
  Edit3,
  Grid,
  KeyRound,
  Loader2,
  Save,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";

import { ProtectedPhoto } from "@/app/_components/protected-photo";
import { deletePhoto, updatePhoto } from "@/app/admin/actions";
import type { AdminActionState } from "@/app/admin/actions";

export type ManagedPhoto = {
  altText: string;
  aperture: string;
  photographerNotes: string;
  camera: string;
  collection: string;
  colorProfile: string;
  copyright: string;
  country: string;
  createdAt: string;
  createdAtRaw?: string;
  description: string;
  shootingConditions: string;
  shootingChallenges: string;
  waitingTime: string;
  interestingFacts: string;
  behindTheShot: string;
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
  "w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

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
    <label className="grid gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PhotoEditModal({
  collections,
  onClose,
  photo,
}: {
  collections: string[];
  onClose: () => void;
  photo: ManagedPhoto;
}) {
  const [activeTab, setActiveTab] = useState<"general" | "behind" | "exif">(
    "general",
  );
  const [adminKey, setAdminKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Load stored admin key from sessionStorage
  useEffect(() => {
    const storedKey = sessionStorage.getItem("admin_key");
    if (storedKey) {
      setAdminKey(storedKey);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const handleAdminKeyChange = (key: string) => {
    setAdminKey(key);
    sessionStorage.setItem("admin_key", key);
  };

  const [updateState, updateAction, updatePending] = useActionState(
    updatePhoto,
    initialAdminActionState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deletePhoto,
    initialAdminActionState,
  );
  const collectionListId = `modal-collections-${photo.id}`;

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
              <ProtectedPhoto
                alt={photo.title}
                className="size-full object-cover"
                src={photo.imageUrl}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-white">
                  {photo.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    photo.published
                      ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {photo.published ? "Live" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">
                {photo.collection || "Uncategorized"} • ID: {photo.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Tutup Modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-zinc-900/50 px-6">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "general"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            Informasi Utama
          </button>
          <button
            onClick={() => setActiveTab("behind")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "behind"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="size-4" />
            Behind the Shot
          </button>
          <button
            onClick={() => setActiveTab("exif")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "exif"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Camera className="size-4" />
            Kamera & EXIF
          </button>
        </div>

        {/* Feedback Messages */}
        {updateState.message ? (
          <div
            className={`mx-6 mt-4 rounded-md border p-3 text-sm ${
              updateState.status === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {updateState.message}
          </div>
        ) : null}

        {deleteState.message ? (
          <div
            className={`mx-6 mt-4 rounded-md border p-3 text-sm ${
              deleteState.status === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {deleteState.message}
          </div>
        ) : null}

        {/* Modal Form Body */}
        <form
          action={updateAction}
          id={`form-edit-${photo.id}`}
          className="flex-1 overflow-y-auto p-6"
        >
          <input name="adminKey" type="hidden" value={adminKey} />
          <input name="id" type="hidden" value={photo.id} />

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Judul Foto">
                  <input
                    className={inputClassName}
                    defaultValue={photo.title}
                    name="title"
                    required
                  />
                </Field>

                <Field label="Kategori / Collection">
                  <input
                    className={inputClassName}
                    defaultValue={photo.collection}
                    list={collectionListId}
                    name="collection"
                    placeholder="Contoh: Travel, Street, Portrait"
                  />
                  <datalist id={collectionListId}>
                    {collections.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
              </div>

              <Field label="Deskripsi Singkat">
                <textarea
                  className={`${inputClassName} min-h-20 resize-y normal-case tracking-normal`}
                  defaultValue={photo.description}
                  name="description"
                  rows={2}
                />
              </Field>

              <Field label="Alt Text (SEO & Accessibility)">
                <input
                  className={inputClassName}
                  defaultValue={photo.altText}
                  name="altText"
                />
              </Field>

              <Field label="Photographer Notes">
                <textarea
                  className={`${inputClassName} min-h-24 resize-y normal-case tracking-normal`}
                  defaultValue={photo.photographerNotes}
                  maxLength={5000}
                  name="photographerNotes"
                  placeholder="Catatan teknis, estetika, atau cerita proses kreatif..."
                  rows={3}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-6 rounded-xl border border-white/10 bg-black/40 p-4">
                <label className="flex items-center gap-2.5 text-sm text-zinc-200 cursor-pointer">
                  <input
                    className="size-4 rounded border-white/20 bg-black text-cyan-400 focus:ring-cyan-400"
                    defaultChecked={photo.published}
                    name="published"
                    type="checkbox"
                  />
                  <span>Tampilkan di Homepage (Published)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: BEHIND THE SHOT */}
          {activeTab === "behind" && (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Shooting Conditions">
                  <input
                    className={inputClassName}
                    defaultValue={photo.shootingConditions}
                    name="shootingConditions"
                    placeholder="Misal: Sunset, Golden Hour, Heavy Fog"
                  />
                </Field>

                <Field label="Waiting Time">
                  <input
                    className={inputClassName}
                    defaultValue={photo.waitingTime}
                    name="waitingTime"
                    placeholder="Misal: 2 Jam menunggu awan menyingkap"
                  />
                </Field>
              </div>

              <Field label="Shooting Challenges">
                <textarea
                  className={`${inputClassName} min-h-20 resize-y normal-case tracking-normal`}
                  defaultValue={photo.shootingChallenges}
                  name="shootingChallenges"
                  placeholder="Tantangan selama proses pengambilan gambar..."
                  rows={2}
                />
              </Field>

              <Field label="Interesting Facts">
                <textarea
                  className={`${inputClassName} min-h-20 resize-y normal-case tracking-normal`}
                  defaultValue={photo.interestingFacts}
                  name="interestingFacts"
                  placeholder="Fakta menarik tentang lokasi atau subjek..."
                  rows={2}
                />
              </Field>

              <Field label="Behind The Shot Story">
                <textarea
                  className={`${inputClassName} min-h-24 resize-y normal-case tracking-normal`}
                  defaultValue={photo.behindTheShot}
                  name="behindTheShot"
                  placeholder="Narasi lengkap di balik pengambilan foto ini..."
                  rows={3}
                />
              </Field>
            </div>
          )}

          {/* TAB 3: EXIF & CAMERA */}
          {activeTab === "exif" && (
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-3">
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
                <Field label="Tanggal Foto">
                  <input
                    className={inputClassName}
                    defaultValue={photo.takenAt}
                    name="takenAt"
                    type="date"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
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
                <Field label="Focal Length">
                  <input
                    className={inputClassName}
                    defaultValue={photo.focalLength}
                    name="focalLength"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="Aperture">
                  <input
                    className={inputClassName}
                    defaultValue={photo.aperture}
                    name="aperture"
                  />
                </Field>
                <Field label="Shutter Speed">
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
                <Field label="Warna Dominan">
                  <input
                    className="h-9 w-full rounded-md border border-white/10 bg-black p-1 cursor-pointer"
                    defaultValue={photo.dominantColor || "#64748b"}
                    name="dominantColor"
                    type="color"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Color Profile">
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
            </div>
          )}
        </form>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 bg-black/80 px-6 py-4">
          <form action={deleteAction} className="shrink-0">
            <input name="adminKey" type="hidden" value={adminKey} />
            <input name="id" type="hidden" value={photo.id} />
            <button
              type="submit"
              disabled={!adminKey || deletePending}
              onClick={(e) => {
                if (!window.confirm(`Yakin ingin menghapus "${photo.title}"?`)) {
                  e.preventDefault();
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {deletePending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Hapus Foto
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Admin Key Input Field in Modal Footer */}
            {(!adminKey || showKeyInput) ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-zinc-900 px-3 py-1.5 text-xs">
                <KeyRound className="size-3.5 text-cyan-400 shrink-0" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => handleAdminKeyChange(e.target.value)}
                  placeholder="Admin Key..."
                  className="w-32 bg-transparent text-white outline-none placeholder:text-zinc-500 text-xs"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowKeyInput(true)}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
              >
                <KeyRound className="size-3" /> Key Aktif
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 transition"
              >
                Batal
              </button>

              <button
                form={`form-edit-${photo.id}`}
                type="submit"
                disabled={!adminKey || updatePending}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2 text-xs font-semibold text-black hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {updatePending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotoManager({ collections, photos }: PhotoManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title" | "published">("latest");
  const [editingPhoto, setEditingPhoto] = useState<ManagedPhoto | null>(null);

  // Filtered & sorted photos calculation
  const filteredPhotos = useMemo(() => {
    const filtered = photos.filter((photo) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.camera.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCollection =
        selectedCollection === "all" || photo.collection === selectedCollection;

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && photo.published) ||
        (statusFilter === "draft" && !photo.published);

      return matchSearch && matchCollection && matchStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "latest") {
        return (b.createdAtRaw || "").localeCompare(a.createdAtRaw || "");
      }
      if (sortBy === "oldest") {
        return (a.createdAtRaw || "").localeCompare(b.createdAtRaw || "");
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "published") {
        return (b.published ? 1 : 0) - (a.published ? 1 : 0);
      }
      return 0;
    });
  }, [photos, searchQuery, selectedCollection, statusFilter, sortBy]);

  return (
    <section className="grid gap-6">
      {/* Control Bar Header */}
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Grid className="size-5 text-cyan-300" />
            Kelola Galeri Foto ({photos.length})
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Daftar foto yang sudah di-upload. Klik foto untuk mengedit detail atau metadata.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, lokasi, kamera..."
            className="w-full rounded-lg border border-white/10 bg-zinc-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/60"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "latest" | "oldest" | "title" | "published")
            }
            className="rounded-lg border border-cyan-400/30 bg-zinc-950 px-3 py-2 text-xs font-medium text-cyan-300 outline-none focus:border-cyan-400"
          >
            <option value="latest">🕒 Terbaru (Latest Uploads)</option>
            <option value="oldest">📜 Terlama</option>
            <option value="title">🔤 Judul (A-Z)</option>
            <option value="published">🟢 Published Dulu</option>
          </select>

          {/* Filter Collection */}
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-400/60"
          >
            <option value="all">Semua Kategori ({collections.length})</option>
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "published" | "draft")
            }
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-400/60"
          >
            <option value="all">Semua Status</option>
            <option value="published">Live Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Minimalist Photo Grid List */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setEditingPhoto(photo)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 transition hover:border-cyan-400/40 hover:shadow-lg cursor-pointer"
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden bg-black">
                <ProtectedPhoto
                  alt={photo.title}
                  src={photo.imageUrl}
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 1280px) 200px, (min-width: 768px) 25vw, 50vw"
                />

                {/* Status Pill */}
                <span
                  className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                    photo.published
                      ? "bg-emerald-500/80 text-white"
                      : "bg-zinc-900/90 text-zinc-400"
                  }`}
                >
                  {photo.published ? "Live" : "Draft"}
                </span>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-black shadow-md">
                    <Edit3 className="size-3.5" />
                    Edit Detail
                  </span>
                </div>
              </div>

              {/* Minimal Card Footer */}
              <div className="p-3">
                <h3 className="truncate text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                  {photo.title}
                </h3>
                <p className="mt-1 truncate text-[11px] text-zinc-500">
                  {photo.collection || "Tanpa Kategori"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-sm text-zinc-500">
            Tidak ada foto yang cocok dengan pencarian / filter Anda.
          </p>
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <PhotoEditModal
          collections={collections}
          onClose={() => setEditingPhoto(null)}
          photo={editingPhoto}
        />
      )}
    </section>
  );
}
