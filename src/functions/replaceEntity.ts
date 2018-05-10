import MissingEntityError from '@js-entity-repos/core/dist/errors/MissingEntityError';
import ReplaceEntity from '@js-entity-repos/core/dist/signatures/ReplaceEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import constructIdFilter from '../utils/constructIdFilter';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): ReplaceEntity<E> => {
  return async ({ id, entity, filter = {} }) => {
    const table = (await config.db()).table(config.tableName);
    const query = config.constructQuery(table);
    const document = config.constructDocument({ ...entity as any, id });
    const constructedFilter = constructIdFilter({ id, filter, config });
    const res = await Promise.resolve(filterEntities(query, constructedFilter).update(document));
    if (!res) {
      throw new MissingEntityError(config.entityName, id);
    }
    return { entity };
  };
};
