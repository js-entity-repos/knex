import OverwriteEntity from '@js-entity-repos/core/dist/signatures/OverwriteEntity';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';
import getEntity from './getEntity';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): OverwriteEntity<Id, Entity> => {
  return async ({ id, entity }) => {
    const table = config.db.table(config.tableName);
    await Promise.resolve(filterEntities(table, id).update(entity));
    return getEntity<Id, Entity>(config)({ id });
  };
};
