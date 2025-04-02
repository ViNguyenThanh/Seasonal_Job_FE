export const saveLocalstorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const removeLocalstorage = (key) => {
  localStorage.removeItem(key);
};

export const loadFromLocalstorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
