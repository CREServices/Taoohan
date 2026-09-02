/**
 * Where an uploaded CV is parked so WhatsApp can link to it.
 *
 * The job-seeker flow is WhatsApp only. A `wa.me` deep link cannot carry a
 * binary attachment, so the CV is stored here and the pre-filled message
 * carries its download URL instead. That URL has to outlive the request that
 * created it — the recruiter opens it minutes or hours later, from a
 * different device — which rules out anything held in memory.
 *
 * TWO DRIVERS, chosen by environment:
 *
 *   VERCEL BLOB (production) — used when BLOB_READ_WRITE_TOKEN is set.
 *     Vercel's filesystem is ephemeral and read-only outside /tmp, so a file
 *     written to disk there is gone by the time anyone clicks the link. Blob
 *     storage is the only thing that actually persists.
 *
 *   LOCAL DISK (development / self-hosted Node) — the fallback. Writes under
 *     `.cv-uploads/` in the project root, served back by /api/cv/[id].
 *     Git-ignored; never part of a build.
 *
 * ⚠️ PHASE 1 — NO DATABASE. Nothing about the applicant is recorded; the file
 * is stored under an unguessable random id and that is the whole of it.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CV_ALLOWED_EXTENSIONS } from "@/lib/applicant";

/** Local driver's directory, relative to the project root. */
const LOCAL_DIR = path.join(process.cwd(), ".cv-uploads");

/**
 * Media types accepted for a CV, matching CV_ALLOWED_EXTENSIONS.
 *
 * Enforced when the client-upload token is minted, so the limit holds at
 * Vercel's edge rather than depending on the browser having behaved.
 */
export const CV_ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const usingBlobStore = (): boolean =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

/**
 * The file extension, lower-cased and validated against the allow-list.
 *
 * Never trust the submitted name: it is attacker-controlled and is about to
 * become part of a path. Anything not on the list becomes ".pdf" rather than
 * being echoed back into the filesystem.
 */
function safeExtension(fileName: string): string {
  const lower = fileName.toLowerCase();
  const match = CV_ALLOWED_EXTENSIONS.find((ext) => lower.endsWith(ext));
  return match ?? ".pdf";
}

/**
 * Stores the CV and returns a URL the recruiter can open from WhatsApp.
 *
 * `origin` is the site's own origin, used only by the local driver to build
 * an absolute link — a relative path would be useless inside a chat message.
 */
export async function storeCv(
  file: File,
  origin: string,
): Promise<string> {
  const extension = safeExtension(file.name);
  const id = `${randomUUID()}${extension}`;

  if (usingBlobStore()) {
    // Imported lazily so a deployment without the token never loads the SDK.
    const { put } = await import("@vercel/blob");
    const { url } = await put(`cv/${id}`, file, {
      access: "public",
      // The id is already unique; without this the SDK appends its own suffix.
      addRandomSuffix: false,
      contentType: file.type || "application/octet-stream",
    });
    return url;
  }

  await mkdir(LOCAL_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(LOCAL_DIR, id), buffer);

  return `${origin.replace(/\/$/, "")}/api/cv/${id}`;
}

/**
 * Reads a locally-stored CV back. Returns null when the id does not resolve
 * to a file inside LOCAL_DIR — which covers both "not found" and any id
 * crafted to climb out of the directory.
 */
export async function readLocalCv(id: string): Promise<Buffer | null> {
  // Reject separators outright, then confirm the resolved path really is
  // inside LOCAL_DIR. Belt and braces: the first check alone would already
  // stop "../", but the second is what actually guarantees containment.
  if (!/^[a-f0-9-]+\.[a-z]+$/i.test(id)) return null;

  const target = path.resolve(LOCAL_DIR, id);
  if (path.dirname(target) !== path.resolve(LOCAL_DIR)) return null;

  try {
    return await readFile(target);
  } catch {
    return null;
  }
}

/** Content type to serve a stored CV back with. */
export function contentTypeFor(id: string): string {
  if (id.endsWith(".pdf")) return "application/pdf";
  if (id.endsWith(".doc")) return "application/msword";
  if (id.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return "application/octet-stream";
}
