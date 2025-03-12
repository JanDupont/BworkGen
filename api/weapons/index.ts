import type { Item } from "../types.ts";

export const weaponsCategoryMap = {
	Axe: 7,
	Dagger: 4,
	Staff: 3,
	Hammer: 8,
	Shovel: 9,
	Lance: 32,
	Pickaxe: 10,
	Sword: 5,
	Wand: 2,
	Bow: 1,
	Scythe: 6,
};

export const weapons: Item[] = [];
readItems();

function readItems(): void {
	const data = JSON.parse(Deno.readTextFileSync("./api/data/weapons.json")) as Item[];
	data.forEach((dItem) => {
		weapons.push(dItem);
	});
}
