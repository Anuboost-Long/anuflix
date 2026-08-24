import { getEpisodePage, getSeason } from "@/lib/tmdb/queries";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string; season: string }> },
) {
	const { id: idParam, season: seasonParam } = await params;
	const id = Number(idParam);
	const season = Number(seasonParam);
	const searchParams = new URL(request.url).searchParams;
	const page = Math.max(1, Number(searchParams.get("page")) || 1);

	if (!Number.isInteger(id) || !Number.isInteger(season) || season < 1) {
		return Response.json({ message: "Invalid TV season." }, { status: 400 });
	}

	try {
		if (searchParams.get("full") === "true") return Response.json(await getSeason(id, season));

		const result = await getEpisodePage({ id, season, page });
		return result
			? Response.json(result)
			: Response.json({ message: "TV season not found." }, { status: 404 });
	} catch {
		return Response.json({ message: "Episodes are temporarily unavailable." }, { status: 502 });
	}
}
