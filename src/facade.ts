import Facade from '@js-entity-repos/core/dist/Facade';
import Config from './Config';
import countEntities from './functions/countEntities';
import createEntity from './functions/createEntity';
import getEntities from './functions/getEntities';
import getEntity from './functions/getEntity';
import overwriteEntity from './functions/overwriteEntity';
import patchEntity from './functions/patchEntity';
import removeEntities from './functions/removeEntities';
import removeEntity from './functions/removeEntity';
import upsertEntity from './functions/upsertEntity';

export default <Id, Entity extends Id>(config: Config<Id, Entity>): Facade<Id, Entity> => {
  return {
    countEntities: countEntities<Id, Entity>(config),
    createEntity: createEntity<Id, Entity>(config),
    getEntities: getEntities<Id, Entity>(config),
    getEntity: getEntity<Id, Entity>(config),
    overwriteEntity: overwriteEntity<Id, Entity>(config),
    patchEntity: patchEntity<Id, Entity>(config),
    removeEntities: removeEntities<Id, Entity>(config),
    removeEntity: removeEntity<Id, Entity>(config),
    upsertEntity: upsertEntity<Id, Entity>(config),
  };
};
