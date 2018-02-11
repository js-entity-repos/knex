import Entity from '@js-entity-repos/core/dist/types/Entity';
import { Filter } from '@js-entity-repos/core/dist/types/Filter';
import FacadeConfig from '../FacadeConfig';

export interface Opts<E extends Entity> {
  readonly id: string;
  readonly filter: Filter<E>;
  readonly config: FacadeConfig<E>;
}

export default <E extends Entity>({ id, filter, config }: Opts<E>) => {
  const idFilter = { id } as Filter<E>;
  const fullFilter = { $and: [idFilter, filter] };
  const constructedFilter = config.constructFilter(fullFilter);
  return constructedFilter;
};
