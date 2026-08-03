"use client";

import {
  Camera,
  Database,
  Grid,
  ImagePlus,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PhotoManager, type ManagedPhoto } from "./photo-manager";
import { PhotoUploadForm } from "./photo-upload-form";

type AdminDashboardProps = {
  collections: string[];
  isConfigured: boolean;
  missingConfig: string[];
  photos: ManagedPhoto[];
};

export function AdminDashboard({
  collections,
  isConfigured,
  missingConfig,
  photos,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"manage" | "upload">("manage");

  const publishedCount = photos.filter((p) => p.published).length;
  const draftCount = photos.length - publishedCount;

  return (
    <div className="grid gap-8">
      {/* Top Admin Header */}
      <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-400">
            <LockKeyhole className="size-4" aria-hidden />
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Yan Saputra Photography
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-400">
            Pusat pengelolaan foto, publikasi, upload media, cerita, dan lisensi unduh.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/admin/stories"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
            >
              📖 Manage Stories
            </Link>
            <Link
              href="/admin/requests"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
            >
              📩 Download Requests
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-xs text-zinc-400 min-w-[320px]">
          <div className="rounded-xl border border-white/10 bg-zinc-950 p-3.5">
            <Database className="size-4 text-amber-300" aria-hidden />
            <span className="mt-2 block text-xl font-bold text-white">
              {photos.length}
            </span>
            <span className="text-[11px] text-zinc-500">Total Foto</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-zinc-950 p-3.5">
            <Camera className="size-4 text-emerald-400" aria-hidden />
            <span className="mt-2 block text-xl font-bold text-white">
              {publishedCount}
            </span>
            <span className="text-[11px] text-zinc-500">Published</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-zinc-950 p-3.5">
            <Sparkles className="size-4 text-cyan-400" aria-hidden />
            <span className="mt-2 block text-xl font-bold text-white">
              {draftCount}
            </span>
            <span className="text-[11px] text-zinc-500">Drafts</span>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950 p-1.5">
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "manage"
                ? "bg-cyan-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid className="size-4" />
            Kelola Galeri Foto ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "upload"
                ? "bg-cyan-400 text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ImagePlus className="size-4" />
            + Upload Foto Baru
          </button>
        </div>

        {activeTab === "manage" && (
          <button
            onClick={() => setActiveTab("upload")}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20 transition"
          >
            <ImagePlus className="size-3.5" />
            Tambah Foto Baru
          </button>
        )}
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === "upload" ? (
        <div className="grid gap-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ImagePlus className="size-5 text-cyan-300" />
                Upload Foto Baru
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Upload gambar ke Cloudinary, isi data EXIF, dan publikasikan ke galeri.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("manage")}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              Kembali ke Galeri
            </button>
          </div>

          <PhotoUploadForm
            isConfigured={isConfigured}
            missingConfig={missingConfig}
          />
        </div>
      ) : (
        <PhotoManager collections={collections} photos={photos} />
      )}
    </div>
  );
}
