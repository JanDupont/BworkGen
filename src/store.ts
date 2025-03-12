// store.ts
import { ref } from "vue";

export const requiredStats = ref<Record<string, number>>({
	ap: 12,
	mp: 5,
	range: 6,
	summons: 2,
	vitality: 4600,
	intelligence: 1200,
	power: 80,
	res_percent_neutral: 20,
	res_percent_earth: 50,
	res_percent_fire: 50,
	res_percent_water: 50,
	res_percent_air: 20,
	res_pushback: 330,
	dmg_fire: 120,
	heals: 110,
});

export const bestStats = ref<Record<string, number>>({});
// deno-lint-ignore no-explicit-any
export const bestStuff = ref<any>(null);
export const algorithmRunning = ref(false);
export const currentGeneration = ref(0);
export const currentFitness = ref(0);
