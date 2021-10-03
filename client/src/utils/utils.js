export function postData(url, data = {}) {
  return fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });
}

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

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function refreshTokenInterval() {
  setInterval(() => {
    postData(`${SERVER_URL}/token`, { refreshToken: getCookie("refreshJwt") })
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        window.alert("Token is no longer valid, please login again.");
        window.location.replace("/index.html");
      });
  },parseInt(TOKEN_INTERVAL,10));
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


export const iconsetPotionsTypes = {
  HEALTH_POTION: 70,
};

export const iconsetSlotsTypes = {
  SLOT_1: 210,
};