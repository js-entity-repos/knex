import GetEntities from '@js-entity-repos/core/dist/signatures/GetEntities';
import createCursorFromEntity from '@js-entity-repos/core/dist/utils/createCursorFromEntity';
import createPaginationFilter from '@js-entity-repos/core/dist/utils/createPaginationFilter';
import { first, last, mapValues } from 'lodash';
import Config from '../Config';
import filterEntities from '../utils/filterEntities';

const xor = (conditionA: boolean, conditionB: boolean) => {
  return (conditionA && !conditionB) || (!conditionA && conditionB);
};

export default <Id, Entity extends Id>(config: Config<Id, Entity>): GetEntities<Entity> => {
  return async ({ filter, sort, pagination }) => {
    const table = config.db.table(config.tableName);

    const paginationFilter = createPaginationFilter(pagination, sort);
    const fullFilter = { $and: [filter, paginationFilter] };
    const knexSort = mapValues(sort, (sortValue: boolean) => {
      return !xor(pagination.forward, sortValue) ? 'asc' : 'desc';
    });

    const filterQuery = filterEntities(table, fullFilter);
    const sortQuery = Object.keys(knexSort).reduce((result, sortKey) => {
      return result.orderBy(sortKey, (knexSort as any)[sortKey]);
    }, filterQuery);
    const limitQuery = sortQuery.limit(pagination.limit);
    const documents = await Promise.resolve(limitQuery);

    const entities = documents.map(config.constructEntity);
    const nextCursor = createCursorFromEntity(last(entities), sort);
    const previousCursor = createCursorFromEntity(first(entities), sort);

    return { entities, nextCursor, previousCursor };
  };
};
