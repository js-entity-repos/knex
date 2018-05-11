import ConflictingEntityError from '@js-entity-repos/core/dist/errors/ConflictingEntityError';
import CreateEntity from '@js-entity-repos/core/dist/signatures/CreateEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';

const conflictErrorCode = 1062;

export default <E extends Entity>(config: FacadeConfig<E>): CreateEntity<E> => {
  return async ({ id, entity }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const document = config.constructDocument({ ...entity as any, id });
    try {
      await Promise.resolve(query.insert(document));
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
