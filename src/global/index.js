const fs = require('fs');
const path = require('path');
const xdg = require('@folder/xdg');

const dirs = xdg();
fs.mkdirSync(dirs.config, { recursive: true });

const GLOBAL_CONFIG_PATH = path.join(dirs.config, 'pgsh_global.json');

const ensureExists = () => {
  if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
    fs.writeFileSync(GLOBAL_CONFIG_PATH, '{}');
  }
};

const readAsObject = () =>
  JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH));

const writeObject = (obj) =>
  fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(obj, null, 2));

module.exports = {
  get: (key) => {
    ensureExists();
    const obj = readAsObject();
    return key ? obj[key] : obj;
  },

  set: (key, value) => {
    ensureExists();
    const obj = readAsObject();
    obj[key] = value;
    writeObject(obj);
  },
};
