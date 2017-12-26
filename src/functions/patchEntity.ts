import PatchEntity from '@js-entity-repos/core/dist/signatures/PatchEntity';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';
import getEntity from './getEntity';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): PatchEntity<Id, Entity> => {
  return async ({ id, patch }) => {
    const table = config.db.table(config.tableName);
    await Promise.resolve(filterEntities(table, id).update(patch));
    return getEntity<Id, Entity>(config)({ id });
  };
};
