import ReplaceEntity from '@js-entity-repos/core/dist/signatures/ReplaceEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import constructIdFilter from '../utils/constructIdFilter';
import filterEntities from '../utils/filterEntities';
import getEntity from './getEntity';

export default <E extends Entity>(config: FacadeConfig<E>): ReplaceEntity<E> => {
  return async ({ id, entity, filter = {} }) => {
    const table = (await config.db()).table(config.tableName);
    const document = config.constructDocument({ ...entity as any, id });
    const constructedFilter = constructIdFilter({ id, filter, config });
    await Promise.resolve(filterEntities(table, constructedFilter).update(document));
    return getEntity<E>(config)({ id, filter });
  };
};
