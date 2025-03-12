export type Effects = {
  ap?: number;
  mp?: number;
  range?: number;
  summons?: number;

  vitality?: number;
  wisdom?: number;

  strength?: number;
  intelligence?: number;
  agility?: number;
  chance?: number;
  power?: number;

  critical?: number;
  pp?: number;
  lock?: number;
  dodge?: number;
  ap_red?: number;
  mp_red?: number;
  ap_parry?: number;
  mp_parry?: number;
  heals?: number;
  reflect?: number;

  initiative?: number;
  pods?: number;

  dmg_neutral?: number;
  dmg_earth?: number;
  dmg_fire?: number;
  dmg_water?: number;
  dmg_air?: number;
  dmg_critical?: number;
  dmg_pushback?: number;
  dmg_percent_spells?: number;
  dmg_percent_weapons?: number;
  dmg_percent_melee?: number;
  dmg_percent_distance?: number;

  res_percent_neutral?: number;
  res_percent_earth?: number;
  res_percent_fire?: number;
  res_percent_water?: number;
  res_percent_air?: number;

  res_neutral?: number;
  res_earth?: number;
  res_fire?: number;
  res_water?: number;
  res_air?: number;

  res_critical?: number;
  res_pushback?: number;
  res_spells?: number;
  res_weapons?: number;
  res_melee?: number;
  res_distance?: number;
};

export type Item = {
  id: number;
  picture: number;
  level: number;
  set_id: number;
  category_id: number;
  subcategory_id: number;
  name: string;
  set_name: string;

  effects: Effects;
};

export type ItemCount = number;

export type Set = {
  id: number;
  level: number;
  count_item: number;
  name: string;
  effects: Record<ItemCount, Effects>;
};

export type Stuff = {
  items: {
    hat: Item;
    cape: Item;
    shield: Item;
    amulet: Item;
    ring1: Item;
    ring2: Item;
    belt: Item;
    boots: Item;
    petSlot: Item;
    weaponSlot: Item;
    DofusSlot1: Item;
    DofusSlot2: Item;
    DofusSlot3: Item;
    DofusSlot4: Item;
    DofusSlot5: Item;
    DofusSlot6: Item;
  };
};
