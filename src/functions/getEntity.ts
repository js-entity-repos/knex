import MissingEntityError from '@js-entity-repos/core/dist/errors/MissingEntityError';
import GetEntity from '@js-entity-repos/core/dist/signatures/GetEntity';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import FacadeConfig from '../FacadeConfig';
import constructIdFilter from '../utils/constructIdFilter';
import filterEntities from '../utils/filterEntities';

export default <E extends Entity>(config: FacadeConfig<E>): GetEntity<E> => {
  return async ({ id, filter = {} }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const constructedFilter = constructIdFilter({ id, filter, config });
    const document = await Promise.resolve(filterEntities(query, constructedFilter).first());

    if (document === undefined || document === null) {
      throw new MissingEntityError(config.entityName, id);
    }

    const entity = config.constructEntity(document);
    return { entity };
  };
};
