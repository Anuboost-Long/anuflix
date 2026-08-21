import { getLiveMatchesPage } from "@/lib/live/client"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const page = Math.max(1, Number(params.get("page")) || 1)

  try {
    return Response.json(await getLiveMatchesPage({
      category: params.get("category") || "all",
      query: params.get("q") || "",
      page,
    }))
  } catch {
    return Response.json({ message: "Live matches are temporarily unavailable." }, { status: 502 })
  }
}
