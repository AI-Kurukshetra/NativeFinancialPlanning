import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Cell persistence is not implemented yet.",
    },
    { status: 501 },
  );
}

