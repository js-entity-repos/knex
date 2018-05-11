import RemoveEntities from '@js-entity-repos/core/dist/signatures/RemoveEntities';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): RemoveEntities<E> => {
  return async ({ filter = {} }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const constructedFilter = config.constructFilter(filter);
    await Promise.resolve(filterEntities(query, constructedFilter).delete());
  };
};
