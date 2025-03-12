import type { Effects, Item, ItemCount, Stuff } from "../types.ts";
import { items } from "../items/index.ts.ts";
import { sets } from "../sets/index.ts";

function calculateEffectContribution(
  item: Item,
  requiredEffects: Effects,
): number {
  let contribution = 0;
  for (const effect in requiredEffects) {
    if (item.effects[effect as keyof Effects]) {
      contribution += Math.min(
        item.effects[effect as keyof Effects] || 0,
        requiredEffects[effect as keyof Effects] || 0,
      );
    }
  }
  return contribution;
}

function findBestItems(requiredEffects: Effects, baseEffects: Effects): Item[] {
  const selectedItems: { [category: string]: Item } = {};
  const currentEffects = { ...baseEffects };

  items.sort(
    (a, b) =>
      calculateEffectContribution(b, requiredEffects) -
      calculateEffectContribution(a, requiredEffects),
  );

  for (const item of items) {
    const category = item.category_id;
    if (selectedItems[category]) {
      continue; // Skip if an item from this category is already selected
    }

    if (
      Object.keys(requiredEffects).every(
        (effect) =>
          (currentEffects[effect as keyof Effects] ?? 0) >=
            (requiredEffects[effect as keyof Effects] ?? 0),
      )
    ) {
      break;
    }

    selectedItems[category] = item;
    for (const effect in item.effects) {
      const key = effect as keyof Effects;
      currentEffects[key] = (currentEffects[key] || 0) +
        (item.effects[key] || 0);
    }
  }

  return Object.values(selectedItems);
}

function calculateCombinedStats(
  bestItems: Item[],
  baseEffects: Effects,
): Effects {
  const combinedStats: Effects = { ...baseEffects };
  const setCounts: { [setId: number]: number } = {};

  for (const item of bestItems) {
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

  return combinedStats;
}

export function greedy(
  minRequiredEffects: Effects,
  baseEffects: Effects,
): { stuff: Stuff; combinedStats: Effects } {
  const bestItems = findBestItems(minRequiredEffects, baseEffects);
  console.log("Best Items:", bestItems);

  const combinedStats = calculateCombinedStats(bestItems, baseEffects);
  console.log("Combined Stats:", combinedStats);

  const stuff: Stuff = {
    items: {
      hat: bestItems.find((item) => item.category_id === 16) || ({} as Item),
      cape: bestItems.find((item) => item.category_id === 17) || ({} as Item),
      shield: bestItems.find((item) => item.category_id === 14) || ({} as Item),
      amulet: bestItems.find((item) => item.category_id === 12) || ({} as Item),
      ring1: bestItems.find((item) => item.category_id === 13) || ({} as Item),
      ring2: bestItems.find((item) => item.category_id === 13) || ({} as Item),
      belt: bestItems.find((item) => item.category_id === 15) || ({} as Item),
      boots: bestItems.find((item) => item.category_id === 19) || ({} as Item),
      petSlot: bestItems.find((item) => item.category_id === 22) ||
        ({} as Item),
      weaponSlot: bestItems.find((item) => item.category_id === 1) ||
        ({} as Item),
      DofusSlot1: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
      DofusSlot2: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
      DofusSlot3: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
      DofusSlot4: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
      DofusSlot5: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
      DofusSlot6: bestItems.find((item) => item.category_id === 20) ||
        ({} as Item),
    },
  };

  return { stuff, combinedStats };
}
