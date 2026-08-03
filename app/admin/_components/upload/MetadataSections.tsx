"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Section = {
  id: string;
  label: string;
  fields: Array<{ label: string; value: string; name?: string }>;
};

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  const hasValues = section.fields.some((field) => field.value);

  if (!hasValues) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
            {section.id}
          </p>
          <h4 className="mt-1 text-sm font-semibold text-white">
            {section.label}
          </h4>
        </div>
        <ChevronDown
          className={`size-4 text-zinc-400 transition ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open ? (
        <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-2">
          {section.fields.map((field) => (
            <div key={`${section.id}-${field.label}`}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {field.label}
              </p>
              <p className="mt-1 text-sm text-zinc-200">{field.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MetadataSections({
  metadata,
}: {
  metadata: Record<string, Record<string, string>> | undefined;
}) {
  if (!metadata) return null;

  const sections: Section[] = [
    {
      id: "General",
      label: "General",
      fields: [
        { label: "Filename", value: metadata.file?.Filename ?? "" },
        { label: "File Type", value: metadata.file?.["File Type"] ?? "" },
        { label: "File Size", value: metadata.file?.["File Size"] ?? "" },
      ],
    },
    {
      id: "Image",
      label: "Image",
      fields: [
        { label: "Width", value: metadata.file?.Width ?? "" },
        { label: "Height", value: metadata.file?.Height ?? "" },
        { label: "Aspect Ratio", value: metadata.file?.["Aspect Ratio"] ?? "" },
        { label: "Megapixels", value: metadata.file?.Megapixels ?? "" },
      ],
    },
    {
      id: "Camera",
      label: "Camera",
      fields: [
        { label: "Camera Make", value: metadata.camera?.["Camera Make"] ?? "" },
        { label: "Camera Model", value: metadata.camera?.["Camera Model"] ?? "" },
      ],
    },
    {
      id: "Lens",
      label: "Lens",
      fields: [
        { label: "Lens Make", value: metadata.camera?.["Lens Make"] ?? "" },
        { label: "Lens Model", value: metadata.camera?.["Lens Model"] ?? "" },
        { label: "Focal Length", value: metadata.lens?.["Focal Length"] ?? "" },
        {
          label: "35mm Equivalent",
          value: metadata.lens?.["35mm Equivalent"] ?? "",
        },
      ],
    },
    {
      id: "Exposure",
      label: "Exposure",
      fields: [
        { label: "Aperture", value: metadata.exposure?.Aperture ?? "" },
        { label: "ISO", value: metadata.exposure?.ISO ?? "" },
        {
          label: "Shutter Speed",
          value: metadata.exposure?.["Shutter Speed"] ?? "",
        },
        {
          label: "Exposure Bias",
          value: metadata.exposure?.["Exposure Bias"] ?? "",
        },
        {
          label: "Metering Mode",
          value: metadata.exposure?.["Metering Mode"] ?? "",
        },
        {
          label: "White Balance",
          value: metadata.exposure?.["White Balance"] ?? "",
        },
        { label: "Flash", value: metadata.exposure?.Flash ?? "" },
      ],
    },
    {
      id: "Location",
      label: "Location",
      fields: [
        { label: "Latitude", value: metadata.gps?.Latitude ?? "" },
        { label: "Longitude", value: metadata.gps?.Longitude ?? "" },
        { label: "Altitude", value: metadata.gps?.Altitude ?? "" },
      ],
    },
    {
      id: "Copyright",
      label: "Copyright",
      fields: [
        { label: "Artist", value: metadata.copyright?.Artist ?? "" },
        { label: "Copyright", value: metadata.copyright?.Copyright ?? "" },
        { label: "Creator", value: metadata.copyright?.Creator ?? "" },
        { label: "Software", value: metadata.copyright?.Software ?? "" },
      ],
    },
    {
      id: "Editing",
      label: "Editing",
      fields: [],
    },
  ];

  return (
    <div className="grid gap-3">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </div>
  );
}

