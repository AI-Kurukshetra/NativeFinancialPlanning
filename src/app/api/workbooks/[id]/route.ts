import { NextResponse, type NextRequest } from "next/server";

import { workbooks } from "@/lib/data/mock-data";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const workbook = workbooks.find((item) => item.id === id);

  if (!workbook) {
    return NextResponse.json({ error: "Workbook not found." }, { status: 404 });
  }

  return NextResponse.json({ data: workbook });
}

export async function PATCH() {
  return NextResponse.json({ error: "Workbook updates are not implemented yet." }, { status: 501 });
}
