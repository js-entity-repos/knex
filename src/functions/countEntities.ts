import CountEntities from '@js-entity-repos/core/dist/signatures/CountEntities';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): CountEntities<Entity> => {
  return async ({ filter }) => {
    const table = config.db.table(config.tableName);
    const [result] = await Promise.resolve(filterEntities(table, filter).count());
    return { count: result['count(*)'] };
  };
};
