"use client";

import { Check, Copy, BookOpenText } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PhotographerNotesCardProps = {
  copied: boolean;
  notes: string;
  onCopy: () => void;
};

export function PhotographerNotesCard({
  copied,
  notes,
  onCopy,
}: PhotographerNotesCardProps) {
  return (
    <motion.section
      className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
            📖 Photographer Notes
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
            <BookOpenText className="size-3.5" aria-hidden />
            <span>Behind the frame</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-zinc-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/10"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy Notes"}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-8 text-zinc-200">
        <div className="[&_p]:m-0 [&_p+_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-cyan-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
        </div>
      </div>
    </motion.section>
  );
}
