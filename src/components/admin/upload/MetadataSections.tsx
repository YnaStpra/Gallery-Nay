"use client";

import { useMemo } from "react";

type FieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  listId?: string;
  helpText?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
};

type MetadataSectionsProps = {
  form: Record<string, string | boolean>;
  suggestions: {
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
  updateField: (name: string, value: string) => void;
};

function Field({
  label,
  name,
  value,
  placeholder,
  type = "text",
  listId,
  helpText,
  onChange,
  multiline,
  rows = 4,
}: FieldProps) {
  const inputClassName =
    "min-h-11 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-200">
      <span>{label}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          className={inputClassName}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          list={listId}
          className={inputClassName}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {helpText ? (
        <p className="text-xs leading-5 text-zinc-500">{helpText}</p>
      ) : null}
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="rounded-[28px] border border-white/10 bg-black/40 p-5 shadow-sm shadow-black/10"
    >
      <summary className="mb-5 flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-white transition-colors hover:text-cyan-200">
        <div>
          <span>{title}</span>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          Toggle
        </span>
      </summary>
      <div className="grid gap-4">{children}</div>
    </details>
  );
}

export function MetadataSections({
  form,
  suggestions,
  updateField,
}: MetadataSectionsProps) {
  const tagOptions = useMemo(
    () => suggestions.tags.map((tag) => tag.trim()).filter(Boolean),
    [suggestions.tags],
  );

  return (
    <div className="space-y-5">
      <Section
        title="General"
        description="Title, description, collection, and basic status."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Title"
            name="title"
            value={String(form.title)}
            placeholder="Enter a descriptive title"
            onChange={(value) => updateField("title", value)}
          />
          <Field
            label="Collection"
            name="collection"
            value={String(form.collection)}
            placeholder="Select or type a collection"
            listId="collection-suggestions"
            onChange={(value) => updateField("collection", value)}
          />
        </div>
        <datalist id="collection-suggestions">
          {suggestions.collections.map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Tags"
            name="tags"
            value={String(form.tags)}
            placeholder="landscape, moody, indonesia"
            helpText="Use commas to separate tags. Existing tags will be suggested."
            listId="tag-suggestions"
            onChange={(value) => updateField("tags", value)}
          />
          <Field
            label="Alt text"
            name="altText"
            value={String(form.altText)}
            placeholder="Alternative text for accessibility"
            onChange={(value) => updateField("altText", value)}
          />
        </div>
        <datalist id="tag-suggestions">
          {tagOptions.map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>
      </Section>

      <Section
        title="Image"
        description="Image-level data and original asset details."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="File name"
            name="originalFileName"
            value={String(form.originalFileName)}
            placeholder="Original filename"
            onChange={(value) => updateField("originalFileName", value)}
          />
          <Field
            label="Color profile"
            name="colorProfile"
            value={String(form.colorProfile)}
            placeholder="sRGB, Adobe RGB"
            listId="software-suggestions"
            onChange={(value) => updateField("colorProfile", value)}
          />
        </div>
      </Section>

      <Section
        title="Camera"
        description="Camera and lens details extracted from EXIF or typed manually."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Camera"
            name="camera"
            value={String(form.camera)}
            placeholder="Sony a7 IV"
            listId="camera-suggestions"
            onChange={(value) => updateField("camera", value)}
          />
          <Field
            label="Lens"
            name="lens"
            value={String(form.lens)}
            placeholder="24-70mm f/2.8"
            listId="lens-suggestions"
            onChange={(value) => updateField("lens", value)}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Camera profile"
            name="cameraProfile"
            value={String(form.cameraProfile)}
            placeholder="Standard, Portrait"
            listId="camera-profile-suggestions"
            onChange={(value) => updateField("cameraProfile", value)}
          />
          <Field
            label="Editing software"
            name="editingSoftware"
            value={String(form.editingSoftware)}
            placeholder="Adobe Lightroom Classic"
            listId="software-suggestions"
            onChange={(value) => updateField("editingSoftware", value)}
          />
        </div>
      </Section>

      <Section
        title="Lens"
        description="Lens-specific details and focal information."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Field
            label="Focal length"
            name="focalLength"
            value={String(form.focalLength)}
            placeholder="35mm"
            onChange={(value) => updateField("focalLength", value)}
          />
          <Field
            label="Aperture"
            name="aperture"
            value={String(form.aperture)}
            placeholder="f/2.8"
            onChange={(value) => updateField("aperture", value)}
          />
          <Field
            label="Shutter speed"
            name="shutterSpeed"
            value={String(form.shutterSpeed)}
            placeholder="1/125s"
            onChange={(value) => updateField("shutterSpeed", value)}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="ISO"
            name="iso"
            value={String(form.iso)}
            placeholder="100"
            type="number"
            onChange={(value) => updateField("iso", value)}
          />
          <Field
            label="Taken at"
            name="takenAt"
            value={String(form.takenAt)}
            placeholder="YYYY-MM-DD"
            type="date"
            onChange={(value) => updateField("takenAt", value)}
          />
        </div>
      </Section>

      <Section
        title="Location"
        description="Where the photo was taken and how it should be described."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Location"
            name="location"
            value={String(form.location)}
            placeholder="Bali, Indonesia"
            listId="location-suggestions"
            onChange={(value) => updateField("location", value)}
          />
          <Field
            label="Country"
            name="country"
            value={String(form.country)}
            placeholder="Indonesia"
            listId="country-suggestions"
            onChange={(value) => updateField("country", value)}
          />
        </div>
      </Section>

      <Section
        title="Copyright"
        description="Usage and ownership references for this photo."
      >
        <Field
          label="Copyright"
          name="copyright"
          value={String(form.copyright)}
          placeholder="(c) Your Name"
          listId="copyright-suggestions"
          onChange={(value) => updateField("copyright", value)}
        />
      </Section>

      <Section
        title="Editing"
        description="Preset, LUT, and editing notes for this asset."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="LUT name"
            name="lutName"
            value={String(form.lutName)}
            placeholder="Moody Forest v2"
            onChange={(value) => updateField("lutName", value)}
          />
          <Field
            label="LUT version"
            name="lutVersion"
            value={String(form.lutVersion)}
            placeholder="2.1"
            onChange={(value) => updateField("lutVersion", value)}
          />
        </div>
        <Field
          label="LUT description"
          name="lutDescription"
          value={String(form.lutDescription)}
          placeholder="Key editing notes for the LUT"
          multiline
          rows={4}
          onChange={(value) => updateField("lutDescription", value)}
        />
      </Section>

      <Section
        title="Photographer Notes"
        description="Write context or notes that support the upload."
      >
        <Field
          label="Photographer Notes"
          name="photographerNotes"
          value={String(form.photographerNotes)}
          placeholder="Describe the shoot, lighting, or story behind the frame"
          multiline
          rows={5}
          onChange={(value) => updateField("photographerNotes", value)}
        />
      </Section>

      <Section
        title="Behind the Shot"
        description="A short story or detail that can appear next to the photo."
      >
        <Field
          label="Behind the shot"
          name="behindTheShot"
          value={String(form.behindTheShot)}
          placeholder="What made this moment special?"
          multiline
          rows={4}
          onChange={(value) => updateField("behindTheShot", value)}
        />
      </Section>
    </div>
  );
}
