import { NextResponse } from "next/server";
import { fetchHotels } from "@/lib/hotels/api";
import { parseApiErrorMessage } from "@/lib/api/parse-error";
import { HOTELS } from "@/lib/data/hotels";

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
    return NextResponse.json(HOTELS, {
      status: 200,
      headers: {
        "x-vasavi-hotels-fallback": "1",
        "x-vasavi-hotels-error": message,
      },
    });
  }
}
