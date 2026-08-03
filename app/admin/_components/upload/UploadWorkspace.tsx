"use client";

import { PhotoUploadForm } from "@/app/admin/_components/photo-upload-form";
import type { GalleryPhoto } from "@/src/lib/gallery-data";

type UploadWorkspaceProps = {
  isConfigured: boolean;
  missingConfig: string[];
  suggestions?: {
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
  defaults?: {
    collection: string;
    country: string;
    camera: string;
    cameraProfile: string;
    editingSoftware: string;
    copyright: string;
  };
  photos?: GalleryPhoto[];
};

export function UploadWorkspace({
  isConfigured,
  missingConfig,
}: UploadWorkspaceProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
          Upload Workspace
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Select Photo, Review Metadata, Publish
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Workflow upload tetap memakai form yang sudah ada, sambil menyiapkan
          ruang untuk preview, autosave, dan metadata grouping berikutnya.
        </p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <PhotoUploadForm
            isConfigured={isConfigured}
            missingConfig={missingConfig}
          />
        </div>
      </div>
    </div>
  );
}

