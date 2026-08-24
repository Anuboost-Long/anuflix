import "server-only";

type QueryValue = string | number | boolean | undefined;

interface ApiConfig {
	url: string | URL;
	method: "GET" | "POST";
	params?: Readonly<Record<string, QueryValue>>;
	data?: unknown;
	headers?: HeadersInit;
	revalidate?: number | false;
}

export class ApiRequestError extends Error {
	constructor(
		message: string,
		readonly status: number,
	) {
		super(message);
		this.name = "ApiRequestError";
	}
}

export async function ApiServiceServer<T>({
	url,
	method,
	params,
	data,
	headers,
	revalidate = false,
}: ApiConfig): Promise<T> {
	const requestUrl = new URL(url);

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value !== undefined) requestUrl.searchParams.set(key, String(value));
	}

	const response = await fetch(requestUrl, {
		method,
		headers,
		body: data === undefined ? undefined : JSON.stringify(data),
		...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
	});

	if (!response.ok) {
		throw new ApiRequestError(`API request failed with status ${response.status}.`, response.status);
	}

	return response.json() as Promise<T>;
}
