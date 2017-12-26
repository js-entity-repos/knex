import RemoveEntities from '@js-entity-repos/core/dist/signatures/RemoveEntities';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): RemoveEntities<Entity> => {
  return async ({ filter }) => {
    const table = config.db.table(config.tableName);
    await Promise.resolve(filterEntities(table, filter).delete());
  };
};
