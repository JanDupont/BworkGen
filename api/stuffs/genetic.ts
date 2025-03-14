import type { Effects, Item, ItemCount, Stuff } from "../types.ts";
import { items } from "../items/index.ts.ts";
import { sets } from "../sets/index.ts";
import { weapons } from "../weapons/index.ts";

// TODO:
// - ap mp < constraints
// - weights balancen:
// 		- wenn mehr als 1 element required, dann power weight = 2, sonst 1
// - trophy support (im prinzip auch constraints)
// - pictures persistieren, wenn nicht vorhanden über dofusbook ziehen und speichern
// - required stats im frontend einstellbar machen
// - Exos checkboxes (AP, MP, Range)
// - frontend stats icons
// - stuff item hover tooltip mit stats, name
// - must-include items (frontend, an backend weitergeben)
// - must-exclude items (frontend, an backend weitergeben)

// - Ergebnisse speichern, in UI wieder auswählbar machen
// - UI: Current Settings in LocalStorage cachen

const effectSink: { [key in keyof Effects]: number } = {
	ap: 100,
	mp: 80,
	range: 51,
	summons: 30,
	vitality: 0.2,
	wisdom: 3,
	strength: 1,
	intelligence: 1.2,
	chance: 1,
	agility: 1,
	power: 2,
	critical: 10,
	pp: 3,
	lock: 4,
	dodge: 4,

	ap_red: 7,
	mp_red: 7,
	ap_parry: 7,
	mp_parry: 7,
	heals: 10,
	reflect: 15,

	initiative: 0.1,
	pods: 2.5,

	dmg_neutral: 5,
	dmg_earth: 5,
	dmg_fire: 5,
	dmg_water: 5,
	dmg_air: 5,
	dmg_critical: 5,
	dmg_pushback: 5,
	dmg_percent_spells: 15,
	dmg_percent_weapons: 15,
	dmg_percent_melee: 15,
	dmg_percent_distance: 15,

	res_percent_neutral: 6,
	res_percent_earth: 6,
	res_percent_fire: 6,
	res_percent_water: 6,
	res_percent_air: 6,

	res_neutral: 2,
	res_earth: 2,
	res_fire: 2,
	res_water: 2,
	res_air: 2,

	res_critical: 2,
	res_pushback: 2,
	res_spells: 15,
	res_weapons: 15,
	res_melee: 15,
	res_distance: 15,
};
function biasWeights(requiredEffects: Effects) {
	const weights: { [key in keyof Effects]: number } = {};
	for (const key in effectSink) {
		if (key === "ap" || key === "mp" || key === "range") {
			// keep original
			weights[key as keyof Effects] = effectSink[key as keyof Effects]!;
			continue;
		}
		// inrease or decrease
		weights[key as keyof Effects] =
			(requiredEffects[key as keyof Effects] ? 1.5 : 0.5) * effectSink[key as keyof Effects]!;
	}
	return weights;
}

const maxEffectsTable: { [key in keyof Effects]: number } = {
	ap: 12,
	mp: 6,
	range: 6,
	critical: 95,
	res_percent_neutral: 50,
	res_percent_earth: 50,
	res_percent_fire: 50,
	res_percent_water: 50,
	res_percent_air: 50,
};

const hats: Item[] = [];
const capes: Item[] = [];
const shields: Item[] = [];
const amulets: Item[] = [];
const rings: Item[] = [];
const belts: Item[] = [];
const boots: Item[] = [];
const pets: Item[] = [];
const petsMounts: Item[] = [];
const dragoturkeys: Item[] = [];
const seemyools: Item[] = [];
const rhineetles: Item[] = [];

const dofuses: Item[] = [];
const trophies: Item[] = [];
const prysmaradites: Item[] = [];
const allPetSlotPets: Item[] = [];
const allDofusSlotItems: Item[] = [];

items.forEach((item) => {
	switch (item.category_id) {
		case 12:
			amulets.push(item);
			break;
		case 13:
			rings.push(item);
			break;
		case 14:
			shields.push(item);
			break;
		case 15:
			belts.push(item);
			break;
		case 16:
			hats.push(item);
			break;
		case 17:
			capes.push(item);
			break;
		case 19:
			boots.push(item);
			break;
		case 20:
			dofuses.push(item);
			allDofusSlotItems.push(item);
			break;
		case 21:
			trophies.push(item);
			//allDofusSlotItems.push(item);
			break;
		case 22:
			pets.push(item);
			allPetSlotPets.push(item);
			break;
		case 23:
			dragoturkeys.push(item);
			allPetSlotPets.push(item);
			break;
		case 24:
			petsMounts.push(item);
			allPetSlotPets.push(item);
			break;
		case 25:
			seemyools.push(item);
			allPetSlotPets.push(item);
			break;
		case 26:
			rhineetles.push(item);
			allPetSlotPets.push(item);
			break;
		case 31:
			prysmaradites.push(item);
			//allDofusSlotItems.push(item);
			break;

		default:
			break;
	}
});

function calculateFitness(
	stuff: Stuff,
	requiredEffects: Effects,
	baseEffects: Effects,
	effectWeights: Effects
): number {
	let fitness = 0;
	const combinedStats = calculateCombinedStats(Object.values(stuff.items), baseEffects);
	// Too High AP MP penalty (exponential)
	if (combinedStats.ap) {
		const maxAP = requiredEffects.ap || maxEffectsTable.ap || 12;
		if (combinedStats.ap > maxAP) {
			fitness -= 1000000 * (combinedStats.ap - maxAP);
			return fitness;
		}
	}
	if (combinedStats.mp) {
		const maxMP = requiredEffects.mp || maxEffectsTable.mp || 6;
		if (combinedStats.mp > maxMP) {
			fitness -= 1000000 * (combinedStats.mp - maxMP);
			return fitness;
		}
	}

	// too low ap mp penalty (small)
	if (effectWeights.ap && requiredEffects.ap) {
		fitness -= effectWeights.ap * Math.max(0, requiredEffects.ap - (combinedStats.ap || 0));
	}
	if (effectWeights.mp && requiredEffects.mp) {
		fitness -= effectWeights.mp * Math.max(0, requiredEffects.mp - (combinedStats.mp || 0));
	}

	for (const effect in requiredEffects) {
		const requiredValue = requiredEffects[effect as keyof Effects] || 0;
		const actualValue = combinedStats[effect as keyof Effects] || 0;
		const maxValue = maxEffectsTable[effect as keyof Effects] || Infinity;
		const weight = effectWeights[effect as keyof Effects] || 1;
		if (actualValue > maxValue) {
			fitness -= weight * (actualValue - maxValue) * (actualValue - maxValue) * 1000;
		} else fitness -= weight * Math.abs(requiredValue - actualValue);
	}
	return fitness;
}

function calculateCombinedStats(bestItems: Item[], baseEffects: Effects): Effects {
	const combinedStats: Effects = { ...baseEffects };
	const setCounts: { [setId: number]: number } = {};

	for (const item of bestItems) {
		if (!item || !item.effects) continue;
		for (const effect in item.effects) {
			const key = effect as keyof Effects;
			combinedStats[key] = (combinedStats[key] || 0) + (item.effects[key] || 0);
		}
		if (item.set_id) {
			setCounts[item.set_id] = (setCounts[item.set_id] || 0) + 1;
		}
	}

	for (const setId in setCounts) {
		const set = sets.find((s) => s.id === Number(setId));
		if (set) {
			const count = setCounts[setId];
			const setBonus = set.effects[count as ItemCount];
			if (setBonus) {
				for (const effect in setBonus) {
					const key = effect as keyof Effects;
					combinedStats[key] = (combinedStats[key] || 0) + (setBonus[key] || 0);
				}
			}
		}
	}

	combinedStats.initiative =
		(combinedStats.initiative || 0) +
		(combinedStats.strength || 0) +
		(combinedStats.intelligence || 0) +
		(combinedStats.chance || 0) +
		(combinedStats.agility || 0);
	combinedStats.pp = (combinedStats.pp || 0) + (combinedStats.chance || 0) / 100;
	combinedStats.dodge = (combinedStats.dodge || 0) + (combinedStats.agility || 0) / 100;
	combinedStats.lock = (combinedStats.lock || 0) + (combinedStats.chance || 0) / 100;
	combinedStats.ap_parry = (combinedStats.ap_parry || 0) + (combinedStats.wisdom || 0) / 100;
	combinedStats.mp_parry = (combinedStats.mp_parry || 0) + (combinedStats.wisdom || 0) / 100;
	combinedStats.ap_red = (combinedStats.ap_red || 0) + (combinedStats.wisdom || 0) / 100;
	combinedStats.mp_red = (combinedStats.mp_red || 0) + (combinedStats.wisdom || 0) / 100;
	combinedStats.pods = (combinedStats.pods || 0) + (combinedStats.strength || 0) * 5;

	// round all stats to 2 decimal places
	for (const key in combinedStats) {
		combinedStats[key as keyof Effects] = Math.round((combinedStats[key as keyof Effects] || 0) * 100) / 100;
	}

	return combinedStats;
}

function createRandomStuff(): Stuff {
	const stuff: Stuff = {
		items: {
			hat: hats[Math.floor(Math.random() * hats.length)] || ({} as Item),
			cape: capes[Math.floor(Math.random() * capes.length)] || ({} as Item),
			shield: shields[Math.floor(Math.random() * shields.length)] || ({} as Item),
			amulet: amulets[Math.floor(Math.random() * amulets.length)] || ({} as Item),
			ring1: rings[Math.floor(Math.random() * rings.length)] || ({} as Item),
			ring2: {} as Item,
			belt: belts[Math.floor(Math.random() * belts.length)] || ({} as Item),
			boots: boots[Math.floor(Math.random() * boots.length)] || ({} as Item),
			petSlot: allPetSlotPets[Math.floor(Math.random() * allPetSlotPets.length)] || ({} as Item),
			weaponSlot: weapons[Math.floor(Math.random() * weapons.length)] || ({} as Item),
			DofusSlot1: allDofusSlotItems[Math.floor(Math.random() * allDofusSlotItems.length)] || ({} as Item),
			DofusSlot2: {} as Item,
			DofusSlot3: {} as Item,
			DofusSlot4: {} as Item,
			DofusSlot5: {} as Item,
			DofusSlot6: {} as Item,
		},
	};

	// Avoid duplicate rings
	do {
		stuff.items.ring2 = rings[Math.floor(Math.random() * rings.length)] || ({} as Item);
	} while (stuff.items.ring2.id === stuff.items.ring1.id);

	// Avoid duplicate dofus slots
	const usedDofusIds = new Set<number>();
	if (stuff.items.DofusSlot1 && stuff.items.DofusSlot1.id) {
		usedDofusIds.add(stuff.items.DofusSlot1.id);
	}

	const dofusSlots = ["DofusSlot2", "DofusSlot3", "DofusSlot4", "DofusSlot5", "DofusSlot6"];
	for (const slot of dofusSlots) {
		let attempts = 0;
		let item: Item;

		do {
			item = allDofusSlotItems[Math.floor(Math.random() * allDofusSlotItems.length)] || ({} as Item);
			attempts++;
			if (attempts > 100) break;
		} while (item && item.id && usedDofusIds.has(item.id));

		if (item && item.id) {
			usedDofusIds.add(item.id);
			stuff.items[slot as keyof Stuff["items"]] = item;
		}
	}

	return stuff;
}

function ensureNoDuplicateDofus(stuff: Stuff): Stuff {
	const dofusSlots = ["DofusSlot1", "DofusSlot2", "DofusSlot3", "DofusSlot4", "DofusSlot5", "DofusSlot6"];
	const usedIds = new Set<number>();

	for (const slot of dofusSlots) {
		const item = stuff.items[slot as keyof Stuff["items"]];
		if (item && item.id) {
			if (usedIds.has(item.id)) {
				// Found a duplicate, replace it with a new unique item
				let newItem: Item;
				do {
					newItem = allDofusSlotItems[Math.floor(Math.random() * allDofusSlotItems.length)];
				} while (newItem && (usedIds.has(newItem.id) || !newItem.id));

				if (newItem) {
					stuff.items[slot as keyof Stuff["items"]] = newItem;
					usedIds.add(newItem.id);
				}
			} else {
				usedIds.add(item.id);
			}
		}
	}

	return stuff;
}

// hard repair too high ap mp
function repairExcessStats(stuff: Stuff, baseEffects: Effects): Stuff {
	const repairedStuff = { items: { ...stuff.items } };
	let combinedStats = calculateCombinedStats(Object.values(repairedStuff.items), baseEffects);

	let attempts = 0;
	const maxAttempts = 50;

	while (
		((combinedStats.ap && maxEffectsTable.ap && combinedStats.ap > maxEffectsTable.ap) ||
			(combinedStats.mp && maxEffectsTable.mp && combinedStats.mp > maxEffectsTable.mp)) &&
		attempts < maxAttempts
	) {
		attempts++;

		// Identify the slot to modify based on which stat is exceeding limits
		let slotToModify: keyof Stuff["items"] | null = null;
		let highestContribution = 0;

		// Find the item contributing the most to the excess stat
		for (const slot in repairedStuff.items) {
			const item = repairedStuff.items[slot as keyof Stuff["items"]];
			if (!item || !item.effects) continue;

			let contribution = 0;
			if (combinedStats.ap && maxEffectsTable.ap && combinedStats.ap > maxEffectsTable.ap && item.effects.ap) {
				contribution += item.effects.ap * 1000; // Prioritize AP fixes
			}
			if (combinedStats.mp && maxEffectsTable.mp && combinedStats.mp > maxEffectsTable.mp && item.effects.mp) {
				contribution += item.effects.mp * 500; // Then MP fixes
			}

			if (contribution > highestContribution) {
				highestContribution = contribution;
				slotToModify = slot as keyof Stuff["items"];
			}
		}

		// If we found a problematic slot, replace it
		if (slotToModify) {
			const slot = slotToModify;
			let replacementFound = false;

			// Try to find a replacement item with fewer AP/MP
			switch (slot) {
				case "hat":
					for (const hat of hats) {
						if (
							!hat.effects ||
							(hat.effects.ap || 0) < (repairedStuff.items.hat.effects?.ap || 0) ||
							(hat.effects.mp || 0) < (repairedStuff.items.hat.effects?.mp || 0)
						) {
							repairedStuff.items.hat = hat;
							replacementFound = true;
							break;
						}
					}
					break;
				case "cape":
					for (const cape of capes) {
						if (
							!cape.effects ||
							(cape.effects.ap || 0) < (repairedStuff.items.cape.effects?.ap || 0) ||
							(cape.effects.mp || 0) < (repairedStuff.items.cape.effects?.mp || 0)
						) {
							repairedStuff.items.cape = cape;
							replacementFound = true;
							break;
						}
					}
					break;

				default: {
					// For other slots, just replace with a random item from the appropriate category
					const randomReplacement = getRandomItemForSlot(slot);
					if (randomReplacement) {
						repairedStuff.items[slot] = randomReplacement;
						replacementFound = true;
					}
				}
			}

			// If no suitable replacement found, just pick a random item for that slot
			if (!replacementFound) {
				repairedStuff.items[slot] = getRandomItemForSlot(slot) || repairedStuff.items[slot];
			}
		} else {
			// If no specific item to replace, just modify a random slot
			const slots = Object.keys(repairedStuff.items);
			const randomSlot = slots[Math.floor(Math.random() * slots.length)] as keyof Stuff["items"];
			repairedStuff.items[randomSlot] = getRandomItemForSlot(randomSlot) || repairedStuff.items[randomSlot];
		}

		// Recalculate stats after the modification
		combinedStats = calculateCombinedStats(Object.values(repairedStuff.items), {});
	}

	// Ensure no duplicate dofus items after repair
	return ensureNoDuplicateDofus(repairedStuff);
}

function getRandomItemForSlot(slot: keyof Stuff["items"]): Item | undefined {
	switch (slot) {
		case "hat":
			return hats[Math.floor(Math.random() * hats.length)];
		case "cape":
			return capes[Math.floor(Math.random() * capes.length)];
		case "shield":
			return shields[Math.floor(Math.random() * shields.length)];
		case "amulet":
			return amulets[Math.floor(Math.random() * amulets.length)];
		case "ring1":
		case "ring2":
			return rings[Math.floor(Math.random() * rings.length)];
		case "belt":
			return belts[Math.floor(Math.random() * belts.length)];
		case "boots":
			return boots[Math.floor(Math.random() * boots.length)];
		case "petSlot":
			return allPetSlotPets[Math.floor(Math.random() * allPetSlotPets.length)];
		case "weaponSlot":
			return weapons[Math.floor(Math.random() * weapons.length)];
		case "DofusSlot1":
		case "DofusSlot2":
		case "DofusSlot3":
		case "DofusSlot4":
		case "DofusSlot5":
		case "DofusSlot6":
			return allDofusSlotItems[Math.floor(Math.random() * allDofusSlotItems.length)];
		default:
			return undefined;
	}
}

function crossover(parent1: Stuff, parent2: Stuff, baseEffects: Effects): Stuff {
	const child: Stuff = { items: { ...parent1.items } };

	for (const slot in child.items) {
		if (Math.random() > 0.5) {
			child.items[slot as keyof Stuff["items"]] = parent2.items[slot as keyof Stuff["items"]];
		}
	}

	const noDuplicatesChild = ensureNoDuplicateDofus(child);
	return repairExcessStats(noDuplicatesChild, baseEffects);
}

function mutate(stuff: Stuff, baseEffects: Effects): Stuff {
	const mutatedStuff: Stuff = { items: { ...stuff.items } };
	const slots = Object.keys(mutatedStuff.items);
	const randomSlot = slots[Math.floor(Math.random() * slots.length)] as keyof Stuff["items"];

	let newItem: Item;
	switch (randomSlot) {
		case "hat":
			newItem = hats[Math.floor(Math.random() * hats.length)];
			break;
		case "cape":
			newItem = capes[Math.floor(Math.random() * capes.length)];
			break;
		case "shield":
			newItem = shields[Math.floor(Math.random() * shields.length)];
			break;
		case "amulet":
			newItem = amulets[Math.floor(Math.random() * amulets.length)];
			break;
		case "ring1":
			do {
				newItem = rings[Math.floor(Math.random() * rings.length)];
			} while (newItem && newItem.id === mutatedStuff.items.ring2.id);
			break;
		case "ring2":
			do {
				newItem = rings[Math.floor(Math.random() * rings.length)];
			} while (newItem && newItem.id === mutatedStuff.items.ring1.id);
			break;
		case "belt":
			newItem = belts[Math.floor(Math.random() * belts.length)];
			break;
		case "boots":
			newItem = boots[Math.floor(Math.random() * boots.length)];
			break;
		case "petSlot":
			newItem = allPetSlotPets[Math.floor(Math.random() * allPetSlotPets.length)];
			break;
		case "weaponSlot":
			newItem = weapons[Math.floor(Math.random() * weapons.length)];
			break;
		case "DofusSlot1":
		case "DofusSlot2":
		case "DofusSlot3":
		case "DofusSlot4":
		case "DofusSlot5":
		case "DofusSlot6":
			newItem = allDofusSlotItems[Math.floor(Math.random() * allDofusSlotItems.length)];
			break;
		default:
			throw new Error(`Unknown slot: ${randomSlot}`);
	}

	if (newItem) {
		mutatedStuff.items[randomSlot] = newItem;
	}

	// After mutation, repair if necessary
	return repairExcessStats(ensureNoDuplicateDofus(mutatedStuff), baseEffects);
}

function tournamentSelection(
	population: Stuff[],
	requiredEffects: Effects,
	baseEffects: Effects,
	effectWeights: Effects,
	tournamentSize = 5
): Stuff {
	const tournament = [];
	for (let i = 0; i < tournamentSize; i++) {
		tournament.push(population[Math.floor(Math.random() * population.length)]);
	}
	tournament.sort(
		(a, b) =>
			calculateFitness(b, requiredEffects, baseEffects, effectWeights) -
			calculateFitness(a, requiredEffects, baseEffects, effectWeights)
	);
	return tournament[0];
}

export async function geneticAlgorithm(
	requiredEffects: Effects,
	baseEffects: Effects,
	populationSize: number,
	generations: number,
	progressCallback?: (generation: number, bestStuff: Stuff, stats: Effects, fitness: number) => void
): Promise<{ stuff: Stuff; combinedStats: Effects }> {
	let population: Stuff[] = Array.from({ length: populationSize }, createRandomStuff);

	const effectWeights = biasWeights(requiredEffects);

	// Make sure initial population is valid
	population = population.map(ensureNoDuplicateDofus).map((stuff) => repairExcessStats(stuff, baseEffects));

	let bestFitnessEver = -Infinity;
	let generationsWithoutImprovement = 0;

	for (let generation = 0; generation < generations; generation++) {
		// Sort by fitness (best first)
		population.sort(
			(a, b) =>
				calculateFitness(b, requiredEffects, baseEffects, effectWeights) -
				calculateFitness(a, requiredEffects, baseEffects, effectWeights)
		);

		// Check if we've improved
		const currentBestFitness = calculateFitness(population[0], requiredEffects, baseEffects, effectWeights);
		if (currentBestFitness > bestFitnessEver) {
			bestFitnessEver = currentBestFitness;
			generationsWithoutImprovement = 0;
		} else {
			generationsWithoutImprovement++;
		}

		if (generation % 10 === 0) {
			const bestStuff = population[0];
			const bestStats = calculateCombinedStats(Object.values(bestStuff.items), baseEffects);

			// Call the progress callback if provided
			if (progressCallback) {
				progressCallback(generation, bestStuff, bestStats, currentBestFitness);
			}

			// Yield to the event loop to allow WebSocket messages to be sent
			// and other requests to be processed
			await new Promise((resolve) => setTimeout(resolve, 0));
		}

		// Elite selection - keep top performers
		const newPopulation: Stuff[] = population.slice(0, Math.max(2, Math.floor(populationSize * 0.1)));

		while (newPopulation.length < populationSize) {
			const parent1 = tournamentSelection(population, requiredEffects, baseEffects, effectWeights);
			const parent2 = tournamentSelection(population, requiredEffects, baseEffects, effectWeights);
			let child = crossover(parent1, parent2, baseEffects);

			if (Math.random() < 0.1) child = mutate(child, baseEffects);

			// Always ensure we have no duplicates and stats are within limits
			child = ensureNoDuplicateDofus(child);
			child = repairExcessStats(child, baseEffects);

			newPopulation.push(child);

			// Yield to event loop every 10 individuals to prevent blocking
			if (newPopulation.length % 10 === 0) {
				await new Promise((resolve) => setTimeout(resolve, 0));
			}
		}

		population = newPopulation;
	}

	const bestStuff = population[0];
	let combinedStats = calculateCombinedStats(Object.values(bestStuff.items), baseEffects);

	// Final validation and repair if needed
	if (
		(combinedStats.ap && maxEffectsTable.ap && combinedStats.ap > maxEffectsTable.ap) ||
		(combinedStats.mp && maxEffectsTable.mp && combinedStats.mp > maxEffectsTable.mp)
	) {
		console.warn("Warning: Final solution exceeds maximum stats. Repairing...");
		const repairedStuff = repairExcessStats(bestStuff, baseEffects);
		combinedStats = calculateCombinedStats(Object.values(repairedStuff.items), baseEffects);
		return { stuff: repairedStuff, combinedStats };
	}

	// Check for duplicate dofus items one last time
	const finalStuff = ensureNoDuplicateDofus(bestStuff);
	combinedStats = calculateCombinedStats(Object.values(finalStuff.items), baseEffects);

	return { stuff: finalStuff, combinedStats };
}
