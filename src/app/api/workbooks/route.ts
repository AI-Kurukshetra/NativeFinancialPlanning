import { NextResponse } from "next/server";

import { workbooks } from "@/lib/data/mock-data";

export async function GET() {
  return NextResponse.json({ data: workbooks });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Workbook creation is not implemented yet.",
    },
    { status: 501 },
  );
}

