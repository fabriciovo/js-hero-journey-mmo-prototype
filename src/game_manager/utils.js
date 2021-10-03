export const SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST',
  ITEM: 'ITEM',
  NPC: 'NPC',

};

export const WeaponTypes = {
  MELEE: 'MELEE',
  RANGED: 'RANGED',
  MAGIC: 'MAGIC',
  POTION: 'POTION',
  GEAR: 'GEAR',


};

export function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}
