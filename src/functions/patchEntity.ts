import PatchEntity from '@js-entity-repos/core/dist/signatures/PatchEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import constructIdFilter from '../utils/constructIdFilter';
import filterEntities from '../utils/filterEntities';
import getEntity from './getEntity';

export default <E extends Entity>(config: FacadeConfig<E>): PatchEntity<E> => {
  return async ({ id, patch, filter = {} }) => {
    const table = (await config.db()).table(config.tableName);
    const query = config.constructQuery(table);
    const document = config.constructDocument({ ...patch as any, id });
    const constructedFilter = constructIdFilter({ id, filter, config });
    await Promise.resolve(filterEntities(query, constructedFilter).update(document));
    return getEntity<E>(config)({ id, filter });
  };
};
