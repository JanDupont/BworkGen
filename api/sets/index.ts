import type { Set } from "../types.ts";

export const sets: Set[] = [];
readSets();

function readSets(): void {
	const data = JSON.parse(Deno.readTextFileSync("./api/data/sets.json")) as Set[];
	data.forEach((dSet) => {
		sets.push(dSet);
	});
}
