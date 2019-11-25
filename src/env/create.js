const fs = require('fs');
const path = require('path');
const findConfig = require('find-config');

const stringifyEnv = require('../util/stringify-env');
const findProjectRoot = require('../util/find-project-root');

/**
 * Create a new dotenv file.
 */
module.exports = (keyValuePairs, encoding = 'utf8') => {
  if (findConfig('.env')) {
    throw new Error('.env file already exists!');
  }

  const createdPath = path.join(
    findProjectRoot(),
    '.env',
  );

  fs.writeFileSync(
    createdPath,
    `# generated by pgsh\n\n${stringifyEnv(keyValuePairs)}\n`,
    { encoding },
  );

  return createdPath;
};
