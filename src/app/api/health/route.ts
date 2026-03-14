import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "excel-native-fpa-platform",
    timestamp: new Date().toISOString(),
  });
}

