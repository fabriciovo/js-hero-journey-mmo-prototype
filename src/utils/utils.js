export const t = 4;

export function createDiv() {
  const div = document.createElement("div");
  div.className = "input-div";
  return div;
}

export function createLabel(labelTarget, text, className) {
  const label = document.createElement("label");
  label.for = labelTarget;
  label.innerText = text;
  label.className = className;
  return label;
}

export function createInputField(inputType, name, id, className, placeholder) {
  const inputField = document.createElement("input");
  inputField.type = inputType;
  inputField.name = name;
  inputField.id = id;
  inputField.className = className;
  if (placeholder) inputField.placeholder = placeholder;
  return inputField;
}

export function createBrElement() {
  return document.createElement("br");
}

export function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}


export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomItem() {
  const randomNumber = getRandomArbitrary(0,9);

  if(randomNumber <= 3){
    return "";
  }else if(randomNumber >= 4 && randomNumber <= 6){
    return "chest";
  }else if(randomNumber >= 7){
    return "item";
  }else {
    return "";
  }
}

export const iconsetWeaponTypes = {
  SMALL_WOODEN_SWORD: 0,
  WOODEN_SWORD: 1,
  BOW: 2,
  LANCE: 3,
  AXE: 4,
  ARROW: 30,
};

export const iconsetGearTypes = {
  WOODEN_ARMOR: 41,
  IRON_ARMOR: 42,
  BOOTS: 46,
  HAT: 47,
  GEAR_2: 48,
  GEAR_3: 49,
  GEAR_4: 50,
  GEAR_5: 51,
  GEAR_6: 52,
};

export const healthBarTypes = {
  HOLDER: 1,
  LIFE_BAR: 4,
  EXP:117,
};

export const iconsetPotionsTypes = {
  HEALTH_POTION: 70,
};

export const iconsetSlotsTypes = {
  SLOT_1: 210,
  SLOT_2: 211,
  SLOT_3: 212,
  SLOT_4: 213,
  SLOT_5: 214,
  SLOT_6: 215,
  SLOT_7: 216,
  SLOT_8: 217,
  SLOT_9: 218,
};

export const DEPTH = {
  NORMAL: 0,
  ENTITIES: 1,
  ENVIROMENT: 2,
  ENVIROMENT_BLOCKED: 3,
  BARS:4,
  UI: 5,
  UI_POPUP: 6,
};

