"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomNumber = randomNumber;
exports.WeaponTypes = exports.SpawnerType = void 0;
var SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST',
  ITEM: 'ITEM'
};
exports.SpawnerType = SpawnerType;
var WeaponTypes = {
  MELEE: 'MELEE',
  RANGED: 'RANGED',
  MAGIC: 'MAGIC',
  POTION: 'POTION',
  GEAR: 'GEAR'
};
exports.WeaponTypes = WeaponTypes;

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}
//# sourceMappingURL=utils.js.map