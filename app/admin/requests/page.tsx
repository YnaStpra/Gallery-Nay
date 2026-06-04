import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Clock, Search } from "lucide-react";

import { updateDownloadRequestStatus } from "./actions";
import { DownloadRequestStatus } from "@/src/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Download Requests",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

const statusLabels: Record<DownloadRequestStatus, string> = {
  APPROVED: "Approved",
  COMPLETED: "Completed",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

const requestTypeLabels = {
  COMMERCIAL_LICENSE: "Commercial license",
  EDITORIAL_USAGE: "Editorial usage",
  HIGH_RES: "High resolution",
  ORIGINAL: "Original",
} as const;

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function matchesQuery(value: string | null | undefined, query: string) {
  return value?.toLowerCase().includes(query) ?? false;
}

export default async function AdminRequestsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim().toLowerCase() ?? "";
  const selectedStatus = Object.values(DownloadRequestStatus).includes(
    params.status as DownloadRequestStatus,
  )
    ? (params.status as DownloadRequestStatus)
    : "ALL";

  const requests = await prisma.downloadRequest.findMany({
    include: {
      photo: {
        select: {
          id: true,
          imageUrl: true,
          location: true,
          title: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  const filteredRequests = requests.filter((request) => {
    const statusMatch =
      selectedStatus === "ALL" || request.status === selectedStatus;
    const queryMatch =
      !query ||
      matchesQuery(request.name, query) ||
      matchesQuery(request.email, query) ||
      matchesQuery(request.photo.title, query) ||
      matchesQuery(request.photo.location, query);

    return statusMatch && queryMatch;
  });

  const pendingCount = requests.filter(
    (request) => request.status === DownloadRequestStatus.PENDING,
  ).length;
  const commercialCount = requests.filter(
    (request) => request.requestType === "COMMERCIAL_LICENSE",
  ).length;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-zinc-50 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Admin upload
            </Link>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
              Requests
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Download requests
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Review original image, high resolution, commercial, and editorial
              requests without exposing public downloads.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-zinc-400">
            <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
              <Clock className="size-5 text-amber-200" aria-hidden />
              <span className="mt-3 block text-2xl font-semibold text-white">
                {pendingCount}
              </span>
              <span>Pending</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
              <CheckCircle2 className="size-5 text-emerald-200" aria-hidden />
              <span className="mt-3 block text-2xl font-semibold text-white">
                {commercialCount}
              </span>
              <span>Commercial</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
              <Search className="size-5 text-cyan-200" aria-hidden />
              <span className="mt-3 block text-2xl font-semibold text-white">
                {requests.length}
              </span>
              <span>Total</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-zinc-950 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <form className="grid gap-2" action="/admin/requests" method="get">
            <label className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Search request
            </label>
            <input
              className="min-h-11 rounded-md border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-cyan-300/60"
              defaultValue={params.q ?? ""}
              name="q"
              placeholder="Name, email, photo, location"
            />
            {selectedStatus !== "ALL" ? (
              <input name="status" type="hidden" value={selectedStatus} />
            ) : null}
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              className={`rounded-md px-3 py-2 text-sm ${
                selectedStatus === "ALL"
                  ? "bg-cyan-300 text-black"
                  : "border border-white/10 text-zinc-300 hover:bg-white/5"
              }`}
              href="/admin/requests"
            >
              All
            </Link>
            {Object.values(DownloadRequestStatus).map((status) => (
              <Link
                className={`rounded-md px-3 py-2 text-sm ${
                  selectedStatus === status
                    ? "bg-cyan-300 text-black"
                    : "border border-white/10 text-zinc-300 hover:bg-white/5"
                }`}
                href={`/admin/requests?status=${status}`}
                key={status}
              >
                {statusLabels[status]}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <article
                className="grid gap-5 rounded-lg border border-white/10 bg-zinc-950 p-5 lg:grid-cols-[1fr_340px]"
                key={request.id}
              >
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                        {requestTypeLabels[request.requestType]}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        {request.photo.title}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-400">
                        {request.name} - {request.email}
                      </p>
                    </div>
                    <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300">
                      {statusLabels[request.status]}
                    </span>
                  </div>

                  <dl className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                        Purpose
                      </dt>
                      <dd className="mt-1 text-zinc-200">{request.reason}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                        Location
                      </dt>
                      <dd className="mt-1 text-zinc-200">
                        {request.photo.location ?? "Not set"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-600">
                        Requested
                      </dt>
                      <dd className="mt-1 text-zinc-200">
                        {dateFormatter.format(request.requestedAt)}
                      </dd>
                    </div>
                  </dl>

                  {request.message ? (
                    <p className="rounded-md border border-white/10 bg-black p-3 text-sm leading-6 text-zinc-300">
                      {request.message}
                    </p>
                  ) : null}
                </div>

                <form
                  action={updateDownloadRequestStatus}
                  className="grid gap-3 rounded-md border border-white/10 bg-black p-4"
                >
                  <input name="id" type="hidden" value={request.id} />
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Admin key
                    <input
                      className="min-h-10 rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-cyan-300/60"
                      name="adminKey"
                      required
                      type="password"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-zinc-300">
                    Status
                    <select
                      className="min-h-10 rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-cyan-300/60"
                      defaultValue={request.status}
                      name="status"
                    >
                      {Object.values(DownloadRequestStatus).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="min-h-10 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-black transition hover:bg-cyan-200"
                    type="submit"
                  >
                    Update status
                  </button>
                </form>
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-white/10 p-6 text-sm text-zinc-500">
              Belum ada request yang cocok dengan filter ini.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
