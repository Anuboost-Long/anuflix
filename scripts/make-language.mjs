import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const languageDirectory = path.join(root, "src/i18n/lang");
const source = JSON.parse(fs.readFileSync(path.join(languageDirectory, "en.json"), "utf8"));

function propertyName(key) {
	return (
		key.charAt(0).toUpperCase() +
		key.slice(1).replaceAll(/[_-](\w)/g, (_, letter) => letter.toUpperCase())
	);
}

function collectPaths(value, prefix = "") {
	if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];

	return Object.entries(value).flatMap(([key, child]) =>
		collectPaths(child, prefix ? `${prefix}.${key}` : key),
	);
}

function buildConstants(value, prefix = "") {
	if (!value || typeof value !== "object" || Array.isArray(value)) return prefix;

	return Object.fromEntries(
		Object.entries(value).map(([key, child]) => {
			const path = prefix ? `${prefix}.${key}` : key;
			return [propertyName(key), buildConstants(child, path)];
		}),
	);
}

const sourcePaths = collectPaths(source);

for (const file of fs
	.readdirSync(languageDirectory)
	.filter((file) => file.endsWith(".json") && file !== "en.json")) {
	const language = JSON.parse(fs.readFileSync(path.join(languageDirectory, file), "utf8"));
	const languagePaths = collectPaths(language);
	const missing = sourcePaths.filter((key) => !languagePaths.includes(key));
	const extra = languagePaths.filter((key) => !sourcePaths.includes(key));

	if (missing.length || extra.length) {
		throw new Error(
			`${file} does not match en.json\nMissing: ${missing.join(", ") || "none"}\nExtra: ${extra.join(", ") || "none"}`,
		);
	}
}

const output = `export const translation = ${JSON.stringify(buildConstants(source), null, 2)} as const;\n`;
const outputFile = path.join(root, "src/constants/translation.ts");
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output);
