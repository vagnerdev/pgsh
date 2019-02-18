const db = require('../../db');
const createKnexfile = require('../../util/create-knexfile');
const readMigrations = require('../../util/read-migrations');
const { spawn } = require('child_process');

exports.command = 'down <ver>';
exports.desc = '(knex) down-migrates the current database to the given version. delegates to knex-migrate';

exports.builder = yargs =>
  yargs
    .positional('ver', {
      describe: 'the migration number to migrate down to',
      type: 'number',
    });

exports.handler = async ({ ver: version }) => {
  const knexfilePath = createKnexfile();
  const migrationsPath = db.getMigrationsPath();
  const migrations = readMigrations(migrationsPath);

  const prefixedVersion = migrations
    .find(m => m.id === version)
    .prefix;

  const command = 
    `knex-migrate down` +
    ` --cwd ${process.cwd()}` +
    ` --to ${prefixedVersion}` +
    ` --knexfile ${knexfilePath}` +
    ` --migrations ${migrationsPath}`

  console.log(command);
  const p = spawn(command, {
    shell: true,
    stdio: 'inherit',
  });
  p.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error('child process exited with ' +
                    `code ${code} and signal ${signal}`);
    } else {
      console.error('Done!');
    }
    process.exit(code);
  });
};
