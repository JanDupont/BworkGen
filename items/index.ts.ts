import type { Item } from "../types.ts";

export const itemsCategoryMap = {
	Hat: 16,
	Cape: 17,
	Shield: 14,
	Amulet: 12,
	Ring: 13,
	Belt: 15,
	Boots: 19,
	Pet: 22, // petSlot
	Petsmount: 24, // petSlot
	Dofus: 20, // DofusSlot
	Trophy: 21, // DofusSlot
	Prysmaradite: 31, // DofusSlot
	Dracoturkey: 23, // petSlot
	Seemyool: 25, // petSlot
	Rhineetle: 26, // petSlot
};

export const items: Item[] = [];
readItems();

function readItems(): void {
	const data = JSON.parse(Deno.readTextFileSync("../data/items.json")) as Item[];
	data.forEach((dItem) => {
		items.push(dItem);
	});
}
