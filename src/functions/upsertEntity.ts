import ConflictingEntityError from '@js-entity-repos/core/dist/errors/ConflictingEntityError';
import UpsertEntity from '@js-entity-repos/core/dist/signatures/UpsertEntity';
import Config from '../Config';
import createEntity from './createEntity';
import overwriteEntity from './overwriteEntity';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): UpsertEntity<Id, Entity> => {
  return async ({ id, entity }) => {
    try {
      return await createEntity(config)({ id, entity });
    } catch (err) {
      if (err instanceof ConflictingEntityError) {
        return overwriteEntity(config)({ id, entity });
      }
      /* istanbul ignore next */
      throw err;
    }
  };
};
