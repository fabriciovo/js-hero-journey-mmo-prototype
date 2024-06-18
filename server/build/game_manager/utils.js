"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeaponTypes = exports.SpawnerType = void 0;
exports.getRandonValues = getRandonValues;
exports.randomNumber = randomNumber;
var SpawnerType = exports.SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST',
  ITEM: 'ITEM',
  NPC: 'NPC'
};
var WeaponTypes = exports.WeaponTypes = {
  MELEE: 'MELEE',
  RANGED: 'RANGED',
  MAGIC: 'MAGIC',
  POTION: 'POTION',
  GEAR: 'GEAR'
};
function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}
function getRandonValues() {
  var bonus = [-3, -5, -6, 0, 5, 3, 4, 7, 2, 1, 8, 10, 11, 23, 12, 13, 14, 15, 16, 9];
  return bonus[Math.floor(Math.random() * bonus.length)];
}
//# sourceMappingURL=utils.js.map