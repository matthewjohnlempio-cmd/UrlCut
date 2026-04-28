import { NextResponse } from "next/server";

const db = new Map(); // TEMP (replace with DB later)

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  const code = generateCode();

  db.set(code, url);

  return NextResponse.json({
    shortUrl: `http://localhost:3000/${code}`,
    code,
  });
}

// export DB for redirect usage (DEV ONLY)
export { db };