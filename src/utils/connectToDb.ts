import * as knex from 'knex';

export default (connectionConfig: knex.Config) => {
  return knex(connectionConfig);
};
