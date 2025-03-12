import type { Set } from "../types.ts";

fetchItems();

async function fetchItems() {
  const sets: Set[] = [];

  for (let page = 1; page <= 8; page++) {
    const url =
      `https://www.dofusbook.net/clothes/dofus/search?context=cloth&page=${page}&sort=desc`;
    const response = await fetch(url);
    const data = await response.json();

    // deno-lint-ignore no-explicit-any
    data.data.forEach((dataSet: any) => {
      const set: Set = {
        id: dataSet.id,
        level: dataSet.level,
        count_item: dataSet.count_item,
        name: dataSet.name,
        effects: {},
      };
      // deno-lint-ignore no-explicit-any
      dataSet.effects.forEach((effect: any) => {
        const count = effect.count;
        if (!set.effects[count]) set.effects[count] = {};
        const effectName = effect.name.toLowerCase().trim();
        switch (effectName) {
          case "pa":
            set.effects[count].ap = effect.value;
            break;
          case "pm":
            set.effects[count].mp = effect.value;
            break;
          case "po":
            set.effects[count].range = effect.value;
            break;
          case "ic":
            set.effects[count].summons = effect.value;
            break;
          case "vi":
            set.effects[count].vitality = effect.value;
            break;
          case "sa":
            set.effects[count].wisdom = effect.value;
            break;
          case "fo":
            set.effects[count].strength = effect.value;
            break;
          case "in":
            set.effects[count].intelligence = effect.value;
            break;
          case "ag":
            set.effects[count].agility = effect.value;
            break;
          case "ch":
            set.effects[count].chance = effect.value;
            break;
          case "pu":
            set.effects[count].power = effect.value;
            break;
          case "cc":
            set.effects[count].critical = effect.value;
            break;
          case "pp":
            set.effects[count].pp = effect.value;
            break;
          case "ta":
            set.effects[count].lock = effect.value;
            break;
          case "fu":
            set.effects[count].dodge = effect.value;
            break;
          case "rpa":
            set.effects[count].ap_red = effect.value;
            break;
          case "rpm":
            set.effects[count].mp_red = effect.value;
            break;
          case "epa":
            set.effects[count].ap_parry = effect.value;
            break;
          case "epm":
            set.effects[count].mp_parry = effect.value;
            break;
          case "so":
            set.effects[count].heals = effect.value;
            break;
          // TODO
          // case "???":
          //     item.effects[count].reflect = effect.value;
          //     break;
          case "ii":
            set.effects[count].initiative = effect.value;
            break;
          // TODO
          // case "???":
          //     item.effects[count].pods = effect.value;
          //     break;
          case "dnf":
            set.effects[count].dmg_neutral = effect.value;
            break;
          case "dtf":
            set.effects[count].dmg_critical = effect.value;
            break;
          case "dff":
            set.effects[count].dmg_fire = effect.value;
            break;
          case "def":
            set.effects[count].dmg_water = effect.value;
            break;
          case "daf":
            set.effects[count].dmg_air = effect.value;
            break;
          case "dc":
            set.effects[count].dmg_critical = effect.value;
            break;
          case "dp":
            set.effects[count].dmg_pushback = effect.value;
            break;
          case "ds":
            set.effects[count].dmg_percent_spells = effect.value;
            break;
          case "dw":
            set.effects[count].dmg_percent_weapons = effect.value;
            break;
          case "dm":
            set.effects[count].dmg_percent_melee = effect.value;
            break;
          case "dd":
            set.effects[count].dmg_percent_distance = effect.value;
            break;

          case "rnp":
            set.effects[count].res_percent_neutral = effect.value;
            break;
          case "rtp":
            set.effects[count].res_percent_earth = effect.value;
            break;
          case "rfp":
            set.effects[count].res_percent_fire = effect.value;
            break;
          case "rep":
            set.effects[count].res_percent_water = effect.value;
            break;
          case "rap":
            set.effects[count].res_percent_air = effect.value;
            break;

          case "rn":
            set.effects[count].res_neutral = effect.value;
            break;
          case "rt":
            set.effects[count].res_earth = effect.value;
            break;
          case "rf":
            set.effects[count].res_fire = effect.value;
            break;
          case "re":
            set.effects[count].res_water = effect.value;
            break;
          case "ra":
            set.effects[count].res_air = effect.value;
            break;

          case "rc":
            set.effects[count].res_critical = effect.value;
            break;
          case "rp":
            set.effects[count].res_pushback = effect.value;
            break;
          case "rs":
            set.effects[count].res_spells = effect.value;
            break;
          case "rw":
            set.effects[count].res_weapons = effect.value;
            break;
          case "rm":
            set.effects[count].res_melee = effect.value;
            break;
          case "rd":
            set.effects[count].res_distance = effect.value;
            break;
        }
      });
      sets.push(set);
    });

    writeItemsFile(sets);
  }
}

function writeItemsFile(sets: Set[]) {
  const path = "./api/data/items.json";
  Deno.writeTextFile(path, JSON.stringify(sets), { create: true });
}
