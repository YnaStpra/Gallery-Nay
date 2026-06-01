"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Save, Trash2 } from "lucide-react";
import { createStory, deleteStory, updateStory } from "@/app/admin/actions";
import { useActionState } from "react";

type ManagedStory = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string;
  location: string | null;
  country: string | null;
  published: boolean;
  publishedAt: string | null;
};

type Props = {
  stories: ManagedStory[];
};

const initialActionState = {
  message: "",
  status: "idle" as const,
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

function StoryManagementCard({
  adminKey,
  story,
}: {
  adminKey: string;
  story: ManagedStory;
}) {
  const [updateState, updateAction, updatePending] = useActionState(
    updateStory,
    initialActionState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteStory,
    initialActionState,
  );

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.25fr]">
        <div className="relative border-b border-white/10 bg-black p-3 lg:border-b-0 lg:border-r">
          <div className="h-40 overflow-hidden rounded-md bg-zinc-900">
            <img
              src={story.coverImage}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`absolute left-5 top-5 inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${story.published ? "bg-emerald-300/90 text-black" : "bg-zinc-900/85 text-zinc-200"}`}
          >
            {story.published ? (
              <Eye className="size-3" aria-hidden />
            ) : (
              <EyeOff className="size-3" aria-hidden />
            )}
            {story.published ? "Live" : "Draft"}
          </span>
        </div>

        <div className="grid gap-5 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Story
              </p>
              <h3 className="mt-2 truncate text-xl font-semibold text-white">
                {story.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">Slug: {story.slug}</p>
            </div>
          </div>

          {updateState.message ? (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${updateState.status === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-red-300/20 bg-red-300/10 text-red-100"}`}
            >
              {updateState.message}
            </p>
          ) : null}

          {deleteState.message ? (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${deleteState.status === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-red-300/20 bg-red-300/10 text-red-100"}`}
            >
              {deleteState.message}
            </p>
          ) : null}

          <form action={updateAction} className="grid gap-4">
            <input name="adminKey" type="hidden" value={adminKey} />
            <input name="id" type="hidden" value={story.id} />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Judul">
                <input
                  className={inputClassName}
                  defaultValue={story.title}
                  name="title"
                  required
                />
              </Field>
              <Field label="Cover image URL">
                <input
                  className={inputClassName}
                  defaultValue={story.coverImage}
                  name="coverImage"
                  required
                />
              </Field>
            </div>

            <Field label="Excerpt">
              <textarea
                className={`${inputClassName} min-h-24 resize-y`}
                defaultValue={story.excerpt ?? ""}
                name="excerpt"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Location">
                <input
                  className={inputClassName}
                  defaultValue={story.location ?? ""}
                  name="location"
                />
              </Field>
              <Field label="Country">
                <input
                  className={inputClassName}
                  defaultValue={story.country ?? ""}
                  name="country"
                />
              </Field>
              <Field label="Publish date">
                <input
                  className={inputClassName}
                  defaultValue={story.publishedAt ?? ""}
                  name="publishedAt"
                  type="date"
                />
              </Field>
            </div>

            <Field label="Story content (JSON)">
              <textarea
                className={`${inputClassName} min-h-28 resize-y font-mono text-[13px]`}
                defaultValue='[{"type":"paragraph","text":"Write your first paragraph here."}]'
                name="content"
              />
            </Field>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input
                  className="size-4 rounded border-white/20 bg-black"
                  defaultChecked={story.published}
                  name="published"
                  type="checkbox"
                />
                Publish story
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
                Simpan story
              </button>
            </div>
          </form>

          <form
            action={deleteAction}
            className="border-t border-red-300/10 pt-4"
          >
            <input name="adminKey" type="hidden" value={adminKey} />
            <input name="id" type="hidden" value={story.id} />
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300/20 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!adminKey || deletePending}
              onClick={(event) => {
                if (!window.confirm(`Hapus story "${story.title}"?`)) {
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
              Hapus story
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export function StoryManagerClient({ stories }: Props) {
  const [adminKey, setAdminKey] = useState("");
  const [createState, createAction, createPending] = useActionState(
    createStory,
    initialActionState,
  );

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-zinc-50 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Story Manager
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Create and manage travel stories, publish drafts, and shape the
              editorial journal.
            </p>
          </div>
        </header>

        <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
                New Story
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Create a story
              </h2>
            </div>
            <div className="grid gap-3 text-sm text-zinc-400 sm:min-w-[320px]">
              <div className="rounded-lg border border-white/10 bg-black p-4">
                <p className="font-semibold text-white">How to publish</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Complete title, cover image, and content JSON. Toggle publish
                  to make it public.
                </p>
              </div>
            </div>
          </div>
          <section className="mt-6">
            {createState.message ? (
              <p
                className={`rounded-md border px-3 py-2 text-sm ${createState.status === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-red-300/20 bg-red-300/10 text-red-100"}`}
              >
                {createState.message}
              </p>
            ) : null}
            <form action={createAction} className="grid gap-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Admin key">
                  <input
                    className={inputClassName}
                    name="adminKey"
                    onChange={(event) => setAdminKey(event.target.value)}
                    placeholder="ADMIN_UPLOAD_KEY"
                    required
                    type="password"
                  />
                </Field>
                <Field label="Cover image URL">
                  <input
                    className={inputClassName}
                    name="coverImage"
                    placeholder="https://"
                    required
                  />
                </Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Title">
                  <input
                    className={inputClassName}
                    name="title"
                    placeholder="Story title"
                    required
                  />
                </Field>
                <Field label="Excerpt">
                  <input
                    className={inputClassName}
                    name="excerpt"
                    placeholder="A short story preview"
                  />
                </Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Location">
                  <input
                    className={inputClassName}
                    name="location"
                    placeholder="Bali"
                  />
                </Field>
                <Field label="Country">
                  <input
                    className={inputClassName}
                    name="country"
                    placeholder="Indonesia"
                  />
                </Field>
                <Field label="Publish date">
                  <input
                    className={inputClassName}
                    name="publishedAt"
                    type="date"
                  />
                </Field>
              </div>
              <Field label="Story content (JSON)">
                <textarea
                  className={`${inputClassName} min-h-28 resize-y font-mono text-[13px]`}
                  defaultValue='[{"type":"paragraph","text":"Start your story with an opening paragraph."}]'
                  name="content"
                />
              </Field>
              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input
                  className="size-4 rounded border-white/20 bg-black"
                  name="published"
                  type="checkbox"
                />
                Publish story immediately
              </label>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={createPending}
                type="submit"
              >
                {createPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                Create story
              </button>
            </form>
          </section>
        </section>

        <section className="space-y-5">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
              Existing stories
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Edit or remove published and draft stories from the journal
              archive.
            </p>
          </div>

          {stories.length > 0 ? (
            <div className="grid gap-5">
              {stories.map((story) => (
                <StoryManagementCard
                  key={story.id}
                  adminKey={adminKey}
                  story={story}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-zinc-400">
              Belum ada story di database.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
