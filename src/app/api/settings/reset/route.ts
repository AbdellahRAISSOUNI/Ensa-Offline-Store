import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/models/Settings";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// DELETE /api/settings/reset - remove settings document
export async function DELETE() {
  await connectToDatabase();
  await Settings.deleteMany({});
  return NextResponse.json({ ok: true });
}


