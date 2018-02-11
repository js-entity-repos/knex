import * as knex from 'knex';
import { once } from 'lodash';

export default (connectionConfig: knex.Config) => {
  return once(async () => {
    return knex(connectionConfig);
  });
};
