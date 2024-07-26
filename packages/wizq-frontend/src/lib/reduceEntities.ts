import type { Entity, KnownAny } from '../types';

type ReduceEntitiesOptions = {
  idKey?: string;
  entityTypeKey?: string;
  callback?: (entity: Entity) => void;
};

/*
  The function accepts a value of any shape and recursively turns objects like { id: 'object_id', entityType: 'object_type' } into 'object_id'.
  It also calls the callback function for each entity so we can use this function to update the store with replaced entities.
  Input:
  {
    id: 'user_1',
    entityType: 'user',
    name: 'Bob Dowson',
  }
  Output: 'user_1'
  
  Input: 
  [{ id: 'user_1', entityType: 'user', name: 'Bob Dowson' }, { id: 'user_2', entityType: 'user', name: 'Joe Dowson' }, { hello: 'world' }, new Set()]
  Output: ['user_1', 'user_2', { hello: 'world' }, new Set()]
  
  Input:
  { success: true, user: { id: 'user_1', entityType: 'user', name: 'Bob Dowson' } }
  POutput:
  { success: true, user: 'user_1' }
*/
export default function reduceEntities<T = KnownAny>(object: KnownAny, options?: ReduceEntitiesOptions): T {
  const result: Record<string, unknown> = {};
  const { entityTypeKey = 'entityType', idKey = 'id', callback } = options ?? {};

  if (Array.isArray(object)) {
    return object.map((item: unknown) => reduceEntities<T>(item, options)) as unknown as T;
  }

  // if primitive return it
  if (typeof object !== 'object' || object === null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return object;
  }

  for (const [key, value] of Object.entries(object as object)) {
    result[key] = typeof value === 'object' && value !== null ? reduceEntities(value, options) : value;
  }

  const entityType = (object as Record<string, unknown>)[entityTypeKey];
  const id = (object as Record<string, unknown>)[idKey];

  // if the object is not an entity, return it
  if (!entityType || !id) return result as T;

  callback?.(result as Entity);

  return id as T;
}
