import ConflictingEntityError from '@js-entity-repos/core/dist/errors/ConflictingEntityError';
import CreateEntity from '@js-entity-repos/core/dist/signatures/CreateEntity';
import Config from '../Config';

const conflictErrorCode = 1062;

export default <Id, Entity extends Id>(config: Config<Id, Entity>): CreateEntity<Id, Entity> => {
  return async ({ id, entity }) => {
    const table = config.db.table(config.tableName);
    const document = config.constructDocument(id, entity);
    try {
      await Promise.resolve(table.insert(document));
    } catch (err) {
      if (err.errno === conflictErrorCode) {
        throw new ConflictingEntityError(config.entityName, id);
      }
      /* istanbul ignore next */
      throw err;
    }
    return { entity };
  };
};
