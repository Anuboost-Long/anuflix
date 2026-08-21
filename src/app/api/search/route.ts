import { searchMedia } from "@/lib/tmdb/queries"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? ""

  if (query.length < 2) {
    return Response.json([])
  }

  try {
    return Response.json((await searchMedia(query)).slice(0, 20))
  } catch {
    return Response.json({ message: "Search is temporarily unavailable." }, { status: 502 })
  }
}
