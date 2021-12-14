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

export function getRandonValues() {
  const bonus = [
    -3, -5, -6, 0, 5, 3, 4, 7, 2, 1, 8, 10, 11, 23, 12, 13, 14, 15, 16, 9,
  ];
  return bonus[Math.floor(Math.random() * bonus.length)];
}