import type { Effects } from "../types.ts";
import { greedy } from "./greedy.ts";
import { geneticAlgorithm } from "./genetic.ts";

const minRequiredEffects: Effects = {
	ap: 12,
	mp: 5,
	range: 6,
	summons: 2,
	vitality: 4600,
	intelligence: 1100,
	power: 100,
	res_percent_neutral: 25,
	res_percent_earth: 45,
	res_percent_fire: 45,
	res_percent_water: 40,
	res_percent_air: 45,
	res_pushback: 300,
	dmg_fire: 120,
	heals: 100,
};
const baseEffects: Effects = {
	ap: 8,
	mp: 4,
	range: 1,
	summons: 1,
	vitality: 495,
	wisdom: 100,
	strength: 100,
	intelligence: 400,
	agility: 100,
	chance: 100,
	power: 0,
	critical: 0,
	pp: 0,
	lock: 0,
	dodge: 0,
	ap_red: 0,
	mp_red: 0,
	ap_parry: 0,
	mp_parry: 0,
	heals: 0,
	reflect: 0,
	initiative: 400,
	pods: 500,
	dmg_neutral: 0,
	dmg_earth: 0,
	dmg_fire: 0,
	dmg_water: 0,
	dmg_air: 0,
	dmg_critical: 0,
	dmg_pushback: 0,
	dmg_percent_spells: 0,
	dmg_percent_weapons: 0,
	dmg_percent_melee: 0,
	dmg_percent_distance: 0,
	res_percent_neutral: 0,
	res_percent_earth: 0,
	res_percent_fire: 0,
	res_percent_water: 0,
	res_percent_air: 0,
	res_neutral: 0,
	res_earth: 0,
	res_fire: 0,
	res_water: 0,
	res_air: 0,
	res_critical: 0,
	res_pushback: 0,
	res_spells: 0,
	res_weapons: 0,
	res_melee: 0,
	res_distance: 0,
};

const greedyResult = greedy(minRequiredEffects, baseEffects);
console.log("Greedy Result:", greedyResult.combinedStats);

const geneticResult = geneticAlgorithm(minRequiredEffects, baseEffects);
console.log("Genetic Result:", geneticResult);
