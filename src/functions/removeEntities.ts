import RemoveEntities from '@js-entity-repos/core/dist/signatures/RemoveEntities';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): RemoveEntities<E> => {
  return async ({ filter = {} }) => {
    const table = (await config.db()).table(config.tableName);
    const constructedFilter = config.constructFilter(filter);
    await Promise.resolve(filterEntities(table, constructedFilter).delete());
  };
};
