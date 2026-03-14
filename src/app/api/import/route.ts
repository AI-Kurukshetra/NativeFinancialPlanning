import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Import pipeline is not implemented yet.",
    },
    { status: 501 },
  );
}
