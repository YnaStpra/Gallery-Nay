"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderPlus, Share2, Trash2 } from "lucide-react";
import { useMyCollections } from "@/src/hooks";

type Photo = {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string;
  location: string | null;
  country: string | null;
};

function getPhotoHref(photo: Photo) {
  return photo.slug ? `/albums/${photo.slug}` : `/albums/${photo.id}`;
}

export default function MyCollectionsPage() {
  const {
    collections,
    isLoaded,
    createCollection,
    deleteCollection,
    renameCollection,
    getCollectionPhotoIds,
    shareCollectionLink,
  } = useMyCollections();

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null,
  );
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (isLoaded) {
      fetch("/api/photos")
        .then((res) => res.json())
        .then(setAllPhotos)
        .catch(console.error);
    }
  }, [isLoaded]);

  const collectionNames = Object.keys(collections);
  const currentPhotos = selectedCollection
    ? getCollectionPhotoIds(selectedCollection)
        .map((id) => allPhotos.find((p) => p.id === id))
        .filter((p): p is Photo => Boolean(p))
    : [];

  const handleCreateCollection = () => {
    if (newName.trim()) {
      createCollection(newName.trim());
      setNewName("");
      setShowCreateForm(false);
      setSelectedCollection(newName.trim());
    }
  };

  const handleRenameCollection = (name: string) => {
    if (editName.trim() && editName.trim() !== name) {
      renameCollection(name, editName.trim());
      setEditingCollection(null);
      setEditName("");
      if (selectedCollection === name) {
        setSelectedCollection(editName.trim());
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Personal
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            My collections
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            Create and organize your favorite photos into personal collections.
            No account needed, stored locally on your device.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Collections List */}
          <aside className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">
                Collections ({collectionNames.length})
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setNewName("");
                }}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-cyan-300 hover:bg-cyan-300/10"
              >
                <FolderPlus className="size-4" aria-hidden />
                New
              </button>
            </div>

            {showCreateForm && (
              <div className="rounded-lg border border-white/10 bg-zinc-950 p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCollection();
                    if (e.key === "Escape") setShowCreateForm(false);
                  }}
                  autoFocus
                  className="w-full rounded border border-white/10 bg-black px-2 py-1 text-sm outline-none focus:border-cyan-300/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCollection}
                    className="flex-1 rounded bg-cyan-300 px-2 py-1 text-xs font-semibold text-black hover:bg-cyan-200"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 rounded border border-white/10 px-2 py-1 text-xs text-zinc-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {collectionNames.length === 0 ? (
                <p className="text-xs text-zinc-500 p-3">
                  No collections yet. Create one to get started.
                </p>
              ) : (
                collectionNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedCollection(name);
                      setEditingCollection(null);
                    }}
                    className={`w-full text-left rounded-lg border p-3 text-sm transition ${
                      selectedCollection === name
                        ? "border-cyan-300/50 bg-cyan-300/10 text-white"
                        : "border-white/10 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{name}</span>
                      <span className="text-xs text-zinc-500">
                        {getCollectionPhotoIds(name).length}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Collection Content */}
          <div>
            {selectedCollection ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    {editingCollection === selectedCollection ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleRenameCollection(selectedCollection);
                          if (e.key === "Escape") setEditingCollection(null);
                        }}
                        className="rounded border border-white/10 bg-black px-3 py-2 text-lg font-semibold outline-none focus:border-cyan-300/50"
                        autoFocus
                      />
                    ) : (
                      <h2 className="text-2xl font-semibold text-white">
                        {selectedCollection}
                      </h2>
                    )}
                    <p className="mt-1 text-sm text-zinc-500">
                      {currentPhotos.length} photo
                      {currentPhotos.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {editingCollection === selectedCollection ? (
                      <>
                        <button
                          onClick={() =>
                            handleRenameCollection(selectedCollection)
                          }
                          className="rounded px-3 py-2 text-sm font-semibold bg-cyan-300 text-black hover:bg-cyan-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCollection(null)}
                          className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCollection(selectedCollection);
                            setEditName(selectedCollection);
                          }}
                          className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            const link =
                              shareCollectionLink(selectedCollection);
                            navigator.clipboard
                              .writeText(link)
                              .then(() =>
                                alert("Collection link copied to clipboard!"),
                              );
                          }}
                          className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                        >
                          <Share2 className="size-4" aria-hidden />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete collection "${selectedCollection}"?`,
                              )
                            ) {
                              deleteCollection(selectedCollection);
                              setSelectedCollection(null);
                            }
                          }}
                          className="rounded border border-red-300/20 px-3 py-2 text-sm text-red-200 hover:bg-red-300/5"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {currentPhotos.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-white/10 p-12 text-center">
                    <p className="text-sm text-zinc-500">
                      No photos in this collection. Add photos while browsing.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {currentPhotos.map((photo) => (
                      <Link
                        key={photo.id}
                        href={getPhotoHref(photo)}
                        className="group overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/60 transition hover:border-cyan-300/30"
                      >
                        <div className="relative aspect-[4/3] bg-zinc-900">
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            fill
                            className="object-cover transition group-hover:scale-105"
                            sizes="(max-width: 1280px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-5">
                          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                            {photo.location}, {photo.country}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-cyan-300">
                            {photo.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 p-12 text-center">
                <FolderPlus
                  className="mx-auto size-12 text-zinc-700"
                  aria-hidden
                />
                <h3 className="mt-4 text-lg font-semibold text-zinc-300">
                  No collection selected
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Create a collection or select one from the list to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
