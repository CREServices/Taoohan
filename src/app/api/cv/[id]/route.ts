import { NextResponse } from "next/server";
import { contentTypeFor, readLocalCv } from "@/lib/cv-storage";

/**
 * Serves a CV stored by the LOCAL driver (development / self-hosted Node).
 *
 * In production on Vercel the upload goes to Blob storage instead and the
 * WhatsApp message links straight at the blob's own URL, so this route is
 * never reached there. It exists so the flow is genuinely testable end to end
 * without a blob token configured.
 *
 * Ids are opaque random UUIDs. `readLocalCv` rejects anything that is not one
 * and confirms the resolved path stays inside the upload directory, so a
 * crafted id cannot read arbitrary files.
 */

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = await readLocalCv(id);

  if (!file) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentTypeFor(id),
      // `inline` so a recruiter tapping the WhatsApp link previews the CV in
      // the browser rather than being handed a download prompt.
      "Content-Disposition": `inline; filename="${id}"`,
      // The id is unguessable and the file never changes under it.
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
