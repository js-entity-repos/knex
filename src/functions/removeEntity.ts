import MissingEntityError from '@js-entity-repos/core/dist/errors/MissingEntityError';
import RemoveEntity from '@js-entity-repos/core/dist/signatures/RemoveEntity';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): RemoveEntity<Id> => {
  return async ({ id }) => {
    const table = config.db.table(config.tableName);
    const count = await Promise.resolve(filterEntities(table, id).delete());

    if (count === 0) {
      throw new MissingEntityError(config.entityName, id);
    }
  };
};
