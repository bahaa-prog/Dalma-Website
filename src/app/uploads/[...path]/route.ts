import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Serves admin-uploaded images from UPLOADS_DIR (outside `public/` and the git
// tree). Works in every environment out of the box; on the VPS this can be
// bypassed entirely by pointing Nginx's `/uploads/` location at UPLOADS_DIR
// directly (see deploy/nginx.conf) so image bytes never touch the Node process.
const UPLOADS_DIR = path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR ?? "./uploads");

const MIME_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Only ever generated one flat, random filename per upload — reject
  // anything else outright (blocks path traversal by construction).
  if (segments.length !== 1 || !/^[a-zA-Z0-9_-]+\.(webp|jpg|jpeg|png)$/.test(segments[0])) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const filePath = path.join(UPLOADS_DIR, segments[0]);
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME_BY_EXT[path.extname(filePath)] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
