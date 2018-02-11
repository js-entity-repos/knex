import CountEntities from '@js-entity-repos/core/dist/signatures/CountEntities';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): CountEntities<E> => {
  return async ({ filter = {} }) => {
    const table = (await config.db()).table(config.tableName);
    const [result] = await Promise.resolve(filterEntities(table, filter).count());
    return { count: result['count(*)'] };
  };
};
