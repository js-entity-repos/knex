import MissingEntityError from '@js-entity-repos/core/dist/errors/MissingEntityError';
import RemoveEntity from '@js-entity-repos/core/dist/signatures/RemoveEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import constructIdFilter from '../utils/constructIdFilter';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): RemoveEntity<E> => {
  return async ({ id, filter = {} }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const constructedFilter = constructIdFilter({ id, filter, config });
    const count = await Promise.resolve(filterEntities(query, constructedFilter).delete());

    if (count === 0) {
      throw new MissingEntityError(config.entityName, id);
    }
  };
};
