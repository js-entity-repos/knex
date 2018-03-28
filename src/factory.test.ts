import facadeTest from '@js-entity-repos/core/dist/tests';
import { TestEntity } from '@js-entity-repos/core/dist/tests/utils/testEntity';
import { config } from 'dotenv';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from './factory';
import connectToDb from './utils/connectToDb';
config();

const db = connectToDb({
  client: 'mysql',
  connection: {
    database: process.env.KNEX_DATABASE,
    host: '127.0.0.1',
    ...(process.env.KNEX_PASSWORD === undefined ? {} : {
      password: process.env.KNEX_PASSWORD,
    }),
    user: process.env.KNEX_USER,
  },
});

const tableName = 'testentities';

before(async () => {
  const schema = (await db()).schema;
  await Promise.resolve(schema.dropTableIfExists(tableName));
  await Promise.resolve(schema.createTable(tableName, async (table) => {
    table.string('id').unique();
    table.string('stringProp');
    table.float('numberProp');
    table.boolean('booleanProp');
  }));
});

facadeTest(factory<TestEntity>({
  constructEntity: (document) => {
    return {
      ...document,
      booleanProp: document.booleanProp === 1,
    };
  },
  db,
  entityName: 'Test Entity',
  tableName,
}));
