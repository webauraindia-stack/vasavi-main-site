import { NextResponse } from "next/server";
import { fetchHotels } from "@/lib/hotels/api";
import { parseApiErrorMessage } from "@/lib/api/parse-error";

/** Live guest houses from Django branches. */
export async function GET() {
  try {
    const hotels = await fetchHotels();
    return NextResponse.json(hotels);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : parseApiErrorMessage(error, "Could not load guest houses.");
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
