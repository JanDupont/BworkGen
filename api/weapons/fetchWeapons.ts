import type { Item } from "../types.ts";

fetchItems();

async function fetchItems() {
	const items: Item[] = [];

	for (let page = 1; page <= 12; page++) {
		const url = `https://www.dofusbook.net/items/dofus/search/weapon?context=item&page=${page}&sort=desc`;
		const response = await fetch(url);
		const data = await response.json();

		// deno-lint-ignore no-explicit-any
		data.data.forEach((dataItem: any) => {
			const item: Item = {
				id: dataItem.id,
				picture: dataItem.picture,
				level: dataItem.level,
				set_id: dataItem.cloth_id,
				category_id: dataItem.category_id,
				subcategory_id: dataItem.subcategory_id,
				name: dataItem.name,
				set_name: dataItem.cloth_name,
				effects: {},
			};
			// deno-lint-ignore no-explicit-any
			dataItem.effects.forEach((effect: any) => {
				const effectName = effect.name.toLowerCase().trim();
				switch (effectName) {
					case "pa":
						item.effects.ap = effect.max;
						break;
					case "pm":
						item.effects.mp = effect.max;
						break;
					case "po":
						item.effects.range = effect.max;
						break;
					case "ic":
						item.effects.summons = effect.max;
						break;
					case "vi":
						item.effects.vitality = effect.max;
						break;
					case "sa":
						item.effects.wisdom = effect.max;
						break;
					case "fo":
						item.effects.strength = effect.max;
						break;
					case "in":
						item.effects.intelligence = effect.max;
						break;
					case "ag":
						item.effects.agility = effect.max;
						break;
					case "ch":
						item.effects.chance = effect.max;
						break;
					case "pu":
						item.effects.power = effect.max;
						break;
					case "cc":
						item.effects.critical = effect.max;
						break;
					case "pp":
						item.effects.pp = effect.max;
						break;
					case "ta":
						item.effects.lock = effect.max;
						break;
					case "fu":
						item.effects.dodge = effect.max;
						break;
					case "rpa":
						item.effects.ap_red = effect.max;
						break;
					case "rpm":
						item.effects.mp_red = effect.max;
						break;
					case "epa":
						item.effects.ap_parry = effect.max;
						break;
					case "epm":
						item.effects.mp_parry = effect.max;
						break;
					case "so":
						item.effects.heals = effect.max;
						break;
					// TODO
					// case "???":
					//     item.effects.reflect = effect.max;
					//     break;
					case "ii":
						item.effects.initiative = effect.max;
						break;
					// TODO
					// case "???":
					//     item.effects.pods = effect.max;
					//     break;
					case "dnf":
						item.effects.dmg_neutral = effect.max;
						break;
					case "dtf":
						item.effects.dmg_critical = effect.max;
						break;
					case "dff":
						item.effects.dmg_fire = effect.max;
						break;
					case "def":
						item.effects.dmg_water = effect.max;
						break;
					case "daf":
						item.effects.dmg_air = effect.max;
						break;
					case "dc":
						item.effects.dmg_critical = effect.max;
						break;
					case "dp":
						item.effects.dmg_pushback = effect.max;
						break;
					case "ds":
						item.effects.dmg_percent_spells = effect.max;
						break;
					case "dw":
						item.effects.dmg_percent_weapons = effect.max;
						break;
					case "dm":
						item.effects.dmg_percent_melee = effect.max;
						break;
					case "dd":
						item.effects.dmg_percent_distance = effect.max;
						break;

					case "rnp":
						item.effects.res_percent_neutral = effect.max;
						break;
					case "rtp":
						item.effects.res_percent_earth = effect.max;
						break;
					case "rfp":
						item.effects.res_percent_fire = effect.max;
						break;
					case "rep":
						item.effects.res_percent_water = effect.max;
						break;
					case "rap":
						item.effects.res_percent_air = effect.max;
						break;

					case "rn":
						item.effects.res_neutral = effect.max;
						break;
					case "rt":
						item.effects.res_earth = effect.max;
						break;
					case "rf":
						item.effects.res_fire = effect.max;
						break;
					case "re":
						item.effects.res_water = effect.max;
						break;
					case "ra":
						item.effects.res_air = effect.max;
						break;

					case "rc":
						item.effects.res_critical = effect.max;
						break;
					case "rp":
						item.effects.res_pushback = effect.max;
						break;
					case "rs":
						item.effects.res_spells = effect.max;
						break;
					case "rw":
						item.effects.res_weapons = effect.max;
						break;
					case "rm":
						item.effects.res_melee = effect.max;
						break;
					case "rd":
						item.effects.res_distance = effect.max;
						break;
				}
			});
			items.push(item);
		});

		writeItemsFile(items);
	}
}

function writeItemsFile(items: Item[]) {
	const path = "./api/data/items.json";
	Deno.writeTextFile(path, JSON.stringify(items), { create: true });
}
