#! /usr/bin/env node
require('dotenv').config();

const execPgsh = require('./util/exec-pgsh');

const pgshrc = `
{
  "mode": "split",
  "vars": {
    "host": "INTEGRATION_HOST",
    "port": "INTEGRATION_PORT",
    "user": "INTEGRATION_USER",
    "password": "INTEGRATION_PASSWORD",
    "database": "INTEGRATION_DATABASE"
  },
  "migrations": {
    "backend": "knex"
  }
}
`;

const env = `
INTEGRATION_HOST=${process.env.INTEGRATION_HOST}
INTEGRATION_PORT=${process.env.INTEGRATION_PORT}
INTEGRATION_USER=${process.env.INTEGRATION_USER}
INTEGRATION_PASSWORD=${process.env.INTEGRATION_PASSWORD}
INTEGRATION_DATABASE=${process.env.INTEGRATION_DATABASE}
`;

const originalDb = process.env.INTEGRATION_DATABASE;


it('prints out the current database correctly', async () => {
  const { exitCode, output } = execPgsh(
    `${__dirname}/knexapp`,
    ['list'],
    env,
    pgshrc,
  );

  // eslint-disable-next-line no-await-in-loop
  for (let line = await output.next(); !line.done; line = await output.next()) {
    if (line.value.startsWith('*')) {
      expect(line.value).toEqual(`* ${originalDb}`);
    }
  }

  expect(await exitCode).toBe(0);
});
