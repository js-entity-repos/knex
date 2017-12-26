import MissingEntityError from '@js-entity-repos/core/dist/errors/MissingEntityError';
import GetEntity from '@js-entity-repos/core/dist/signatures/GetEntity';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): GetEntity<Id, Entity> => {
  return async ({ id }) => {
    const table = config.db.table(config.tableName);
    const document = await Promise.resolve(filterEntities(table, id).first());

    if (document === undefined || document === null) {
      throw new MissingEntityError(config.entityName, id);
    }

    const entity = config.constructEntity(document);
    return { entity };
  };
};
