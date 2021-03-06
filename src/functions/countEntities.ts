import CountEntities from '@js-entity-repos/core/dist/signatures/CountEntities';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): CountEntities<E> => {
  return async ({ filter = {} }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const constructedFilter = config.constructFilter(filter);
    const [result] = await Promise.resolve(filterEntities(query, constructedFilter).count());
    return { count: result['count(*)'] };
  };
};
