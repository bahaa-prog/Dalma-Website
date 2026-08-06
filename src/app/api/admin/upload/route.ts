import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOADS_DIR = path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR ?? "./uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_WIDTH = 1600;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "حجم الملف كبير جداً (الحد الأقصى ٥ ميجابايت)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Re-encoding via sharp (rather than trusting the reported mime type)
    // both strips EXIF and verifies the bytes are actually a real image.
    let image = sharp(buffer, { failOn: "error" }).rotate();
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("no dimensions");
    }
    if (metadata.width > MAX_WIDTH) {
      image = image.resize({ width: MAX_WIDTH });
    }
    const output = await image.webp({ quality: 82 }).toBuffer();
    const finalMeta = await sharp(output).metadata();

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const filename = `${crypto.randomUUID()}.webp`;
    await fs.writeFile(path.join(UPLOADS_DIR, filename), output);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      width: finalMeta.width,
      height: finalMeta.height,
    });
  } catch {
    return NextResponse.json({ error: "ملف الصورة غير صالح." }, { status: 400 });
  }
}
