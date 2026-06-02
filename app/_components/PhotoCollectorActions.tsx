"use client";

import { Copy, Facebook, MessageCircle, Send, Share2 } from "lucide-react";
import { useState } from "react";

import { useMyCollections } from "@/src/hooks";
import { FavoriteButton } from "./FavoriteButton";

type PhotoCollectorActionsProps = {
  photoId: string;
  title: string;
  slug?: string;
};

const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/5";

function buildPhotoUrl(slug: string | undefined, photoId: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/#${slug ?? photoId}`;
}

export function PhotoCollectorActions({
  photoId,
  slug,
  title,
}: PhotoCollectorActionsProps) {
  const {
    addPhotoToCollection,
    createCollection,
    getAllCollectionNames,
    getCollectionPhotoIds,
  } = useMyCollections();
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [message, setMessage] = useState("");

  const collectionNames = getAllCollectionNames();
  const shareUrl = buildPhotoUrl(slug, photoId);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const addToSelectedCollection = () => {
    if (!selectedCollection) {
      setMessage("Pilih collection terlebih dahulu.");
      return;
    }

    addPhotoToCollection(selectedCollection, photoId);
    setMessage(`Ditambahkan ke ${selectedCollection}.`);
  };

  const createAndAddCollection = () => {
    const trimmed = newCollection.trim();

    if (!trimmed) {
      setMessage("Nama collection wajib diisi.");
      return;
    }

    createCollection(trimmed);
    addPhotoToCollection(trimmed, photoId);
    setSelectedCollection(trimmed);
    setNewCollection("");
    setMessage(`Collection ${trimmed} dibuat dan foto ditambahkan.`);
  };

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setMessage("Link foto disalin.");
  };

  const nativeShare = async () => {
    if (!shareUrl || !navigator.share) {
      await copyLink();
      return;
    }

    await navigator.share({
      title,
      text: `Yan Saputra Photography - ${title}`,
      url: shareUrl,
    });
  };

  return (
    <section className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Collector tools
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Save, collect, and share this frame.
          </p>
        </div>
        <FavoriteButton photoId={photoId} showCount />
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
          Add to collection
          <select
            className="min-h-10 rounded-md border border-white/10 bg-black px-3 text-sm normal-case tracking-normal text-white outline-none focus:border-cyan-300/60"
            onChange={(event) => setSelectedCollection(event.target.value)}
            value={selectedCollection}
          >
            <option value="">Choose collection</option>
            {collectionNames.map((name) => (
              <option key={name} value={name}>
                {name} ({getCollectionPhotoIds(name).length})
              </option>
            ))}
          </select>
        </label>
        <button
          className={secondaryButtonClass}
          onClick={addToSelectedCollection}
          type="button"
        >
          Add selected
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          className="min-h-10 rounded-md border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300/60"
          onChange={(event) => setNewCollection(event.target.value)}
          placeholder="New collection name"
          value={newCollection}
        />
        <button
          className={secondaryButtonClass}
          onClick={createAndAddCollection}
          type="button"
        >
          Create
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button className={secondaryButtonClass} onClick={nativeShare} type="button">
          <Share2 className="size-4" aria-hidden />
          Share
        </button>
        <button className={secondaryButtonClass} onClick={copyLink} type="button">
          <Copy className="size-4" aria-hidden />
          Copy
        </button>
        <a
          className={secondaryButtonClass}
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </a>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <a
          className={secondaryButtonClass}
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          rel="noreferrer"
          target="_blank"
        >
          <Send className="size-4" aria-hidden />
          X
        </a>
        <a
          className={secondaryButtonClass}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          rel="noreferrer"
          target="_blank"
        >
          <Facebook className="size-4" aria-hidden />
          Facebook
        </a>
        <a
          className={secondaryButtonClass}
          href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`}
          rel="noreferrer"
          target="_blank"
        >
          Threads
        </a>
      </div>

      {message ? (
        <p className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}
    </section>
  );
}
