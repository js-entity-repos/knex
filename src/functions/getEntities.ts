import GetEntities from '@js-entity-repos/core/dist/signatures/GetEntities';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import Sort from '@js-entity-repos/core/dist/types/Sort';
import createCursorFromEntity from '@js-entity-repos/core/dist/utils/createCursorFromEntity';
import createPaginationFilter from '@js-entity-repos/core/dist/utils/createPaginationFilter';
import { first, last, mapValues } from 'lodash';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

const xor = (conditionA: boolean, conditionB: boolean) => {
  return (conditionA && !conditionB) || (!conditionA && conditionB);
};

export default <E extends Entity>(config: FacadeConfig<E>): GetEntities<E> => {
  const defaultPagination = {
    cursor: undefined,
    forward: true,
    limit: config.defaultPaginationLimit,
  };
  const defaultSort = { id: true } as Sort<E>;
  return async ({ filter = {}, sort = defaultSort, pagination = defaultPagination }) => {
    const table = (await config.db()).table(config.tableName);

    const paginationFilter = createPaginationFilter(pagination, sort);
    const fullFilter = { $and: [filter, paginationFilter] };
    const constructedFilter = config.constructFilter(fullFilter);
    const constructedSort = config.constructSort(sort);
    const knexSort = mapValues(constructedSort, (sortValue): string => {
      return !xor(pagination.forward, sortValue) ? 'asc' : 'desc';
    });

    const filterQuery = filterEntities(table, constructedFilter);
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
