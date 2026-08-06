import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/login-rate-limit";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const key = clientKey(req);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "محاولات دخول كثيرة، حاول لاحقاً." },
      { status: 429 }
    );
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة." }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return NextResponse.json({ error: "الخادم غير معدّ بشكل صحيح." }, { status: 500 });
  }

  const usernameOk = username === adminUsername;
  const passwordOk = await bcrypt.compare(password, adminPasswordHash);

  if (!usernameOk || !passwordOk) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
  }

  clearAttempts(key);
  const token = await createSessionToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
