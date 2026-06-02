"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

type DownloadRequestPanelProps = {
  photoId: string;
  photoTitle: string;
};

type RequestType =
  | "ORIGINAL"
  | "HIGH_RES"
  | "COMMERCIAL_LICENSE"
  | "EDITORIAL_USAGE";

const requestTypes: { label: string; value: RequestType }[] = [
  { label: "Original image", value: "ORIGINAL" },
  { label: "High resolution", value: "HIGH_RES" },
  { label: "Commercial license", value: "COMMERCIAL_LICENSE" },
  { label: "Editorial usage", value: "EDITORIAL_USAGE" },
];

const inputClassName =
  "min-h-10 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

export function DownloadRequestPanel({
  photoId,
  photoTitle,
}: DownloadRequestPanelProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setPending(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch(`/api/photo/${photoId}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
          name: String(formData.get("name") ?? ""),
          purpose: String(formData.get("purpose") ?? ""),
          requestType: String(formData.get("requestType") ?? "ORIGINAL"),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Request failed");
      }

      form.reset();
      setStatus("success");
      setMessage("Request terkirim. Yan bisa meninjau dari admin dashboard.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Request gagal dikirim. Coba lagi.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200">
        Request access
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{photoTitle}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Original files are not downloadable publicly. Send a request for review.
      </p>

      <form className="mt-4 grid gap-3" onSubmit={submitRequest}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={inputClassName}
            name="name"
            placeholder="Name"
            required
          />
          <input
            className={inputClassName}
            name="email"
            placeholder="Email"
            required
            type="email"
          />
        </div>
        <select className={inputClassName} name="requestType" required>
          {requestTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <input
          className={inputClassName}
          name="purpose"
          placeholder="Purpose or usage context"
          required
        />
        <textarea
          className={`${inputClassName} min-h-24 resize-y`}
          name="message"
          placeholder="Message"
        />
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber-200 px-4 text-sm font-semibold text-black transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Send request
        </button>
      </form>

      {message ? (
        <p
          className={`mt-3 rounded-md border px-3 py-2 text-sm ${
            status === "success"
              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
              : "border-red-300/20 bg-red-300/10 text-red-100"
          }`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
