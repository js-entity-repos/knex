import GetEntities from '@js-entity-repos/core/dist/signatures/GetEntities';
import { start } from '@js-entity-repos/core/dist/types/Cursor';
import Entity from '@js-entity-repos/core/dist/types/Entity';
import Pagination from '@js-entity-repos/core/dist/types/Pagination';
import { forward } from '@js-entity-repos/core/dist/types/PaginationDirection';
import Sort from '@js-entity-repos/core/dist/types/Sort';
import SortOrder, { asc } from '@js-entity-repos/core/dist/types/SortOrder';
import createGetEntitiesResult from '@js-entity-repos/core/dist/utils/createGetEntitiesResult';
import createPaginationFilter from '@js-entity-repos/core/dist/utils/createPaginationFilter';
import { mapValues } from 'lodash';
import FacadeConfig from '../FacadeConfig';
import filterEntities from '../utils/filterEntities';

const xor = (conditionA: boolean, conditionB: boolean) => {
  return (conditionA && !conditionB) || (!conditionA && conditionB);
};

export default <E extends Entity>(config: FacadeConfig<E>): GetEntities<E> => {
  const defaultPagination: Pagination = {
    cursor: start,
    direction: forward,
    limit: config.defaultPaginationLimit,
  };
  const defaultSort = { id: asc } as Sort<E>;
  return async ({ filter = {}, sort = defaultSort, pagination = defaultPagination }) => {
    const db = (await config.db());
    const query = config.constructQuery(db);
    const paginationFilter = createPaginationFilter(pagination, sort);
    const fullFilter = { $and: [filter, paginationFilter] };
    const constructedFilter = config.constructFilter(fullFilter);
    const constructedSort = config.constructSort(sort);
    const knexSort = mapValues(constructedSort, (sortOrder: SortOrder): string => {
      return !xor(pagination.direction === forward, sortOrder === asc) ? 'asc' : 'desc';
    });

    const filterQuery = filterEntities(query, constructedFilter);
    const sortQuery = Object.keys(knexSort).reduce((result, sortKey) => {
      return result.orderBy(sortKey, (knexSort as any)[sortKey]);
    }, filterQuery);
    const limitQuery = sortQuery.limit(pagination.limit + 1);
    const results = await Promise.resolve(limitQuery);
    const documents = results.slice(0, pagination.limit);

    const entities: E[] = documents.map(config.constructEntity);
    const isEnd = results.length <= pagination.limit;

    return createGetEntitiesResult({ entities, isEnd, pagination, sort });
  };
};
