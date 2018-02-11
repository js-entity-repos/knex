// tslint:disable:no-use-before-declare max-file-line-count
import Entity from '@js-entity-repos/core/dist/types/Entity';
import {
  ConditionFilter,
  EntityFilter,
  Filter,
  PropFilter,
} from '@js-entity-repos/core/dist/types/Filter';
import { QueryBuilder } from 'knex';

const addAndToQuery = <E extends Entity>(query: QueryBuilder, filters: Filter<E>[]) => {
  return filters.reduce((result, filter) => {
    return constructFilter(result, filter);
  }, query);
};

const addOrToQuery = <E extends Entity>(query: QueryBuilder, filters: Filter<E>[]) => {
  return filters.reduce((result, filter) => {
    return result.orWhere(function (this: QueryBuilder) {
      // tslint:disable-next-line:no-invalid-this no-this
      constructFilter(this, filter);
    });
  }, query);
};

const addNorToQuery = <E extends Entity>(query: QueryBuilder, filters: Filter<E>[]) => {
  return query.whereNot(function (this: QueryBuilder) {
    // tslint:disable-next-line:no-invalid-this no-this
    addOrToQuery(this, filters);
  });
};

const addOpToQuery = (query: QueryBuilder, prop: string, op: string, value: any) => {
  if (value !== undefined) {
    return query.where(prop, op, value);
  }
  return query;
};

const constructPropFilter = <Prop>(
  query: QueryBuilder,
  prop: string,
  filterValue: PropFilter<Prop>,
) => {
  const eqQuery = (filterValue.$eq === undefined ? query :
    query.where(prop, filterValue.$eq as any)
  );
  const neQuery = addOpToQuery(eqQuery, prop, '<>', filterValue.$ne);
  const ltQuery = addOpToQuery(neQuery, prop, '<', filterValue.$lt);
  const lteQuery = addOpToQuery(ltQuery, prop, '<=', filterValue.$lte);
  const gtQuery = addOpToQuery(lteQuery, prop, '>', filterValue.$gt);
  const gteQuery = addOpToQuery(gtQuery, prop, '>=', filterValue.$gte);
  const inQuery = (filterValue.$in === undefined ? gteQuery :
    gteQuery.whereIn(prop, filterValue.$in as any[])
  );
  const ninQuery = (filterValue.$nin === undefined ? inQuery :
    inQuery.whereNotIn(prop, filterValue.$nin as any[])
  );
  const notQuery = (filterValue.$not === undefined ? ninQuery :
    ninQuery.whereNot(function (this: QueryBuilder) {
      // tslint:disable-next-line:no-this no-invalid-this
      constructPropFilter(this, prop, filterValue.$not as PropFilter<Prop>);
    })
  );
  return notQuery;
};

const constructEntityFilter = <E extends Entity>(query: QueryBuilder, filter: EntityFilter<E>) => {
  return Object.keys(filter).reduce((result, prop) => {
    const filterValue = (filter as any)[prop];
    if (!(filterValue instanceof Object)) {
      return result.where(prop, filterValue);
    } else {
      return constructPropFilter(query, prop, filterValue);
    }
  }, query);
};

const constructConditionFilter = <E extends Entity>(
  query: QueryBuilder,
  filter: ConditionFilter<E>,
): QueryBuilder => {
  if (filter.$and !== undefined) {
    return addAndToQuery(query, filter.$and);
  }
  if (filter.$or !== undefined) {
    return addOrToQuery(query, filter.$or);
  }
  if (filter.$nor !== undefined) {
    return addNorToQuery(query, filter.$nor);
  }
  return query;
};

const constructFilter = <E extends Entity>(
  query: QueryBuilder,
  filter: Filter<E>,
): QueryBuilder => {
  const conditionQuery = constructConditionFilter(query, filter as any);
  return constructEntityFilter(conditionQuery, filter as EntityFilter<E>);
};

export default constructFilter;
