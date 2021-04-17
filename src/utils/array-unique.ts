type Primitive = string|number|boolean;
type Getter<T, E> = (item: T) => E;
type TypeOrGetter<T, K, E> = K|Getter<T, E>;

function accessProperty<T, K extends (T extends object ? keyof T : never), E extends T|T[K]|Primitive>(item: T, keyOrGetter?: TypeOrGetter<T, K, E>): E {
  if (!keyOrGetter) {
    return item as E;
  }
  switch (typeof keyOrGetter) {
    case 'function':
      return keyOrGetter(item);
    case 'boolean':
    case 'string':
    case 'number':
      if (keyOrGetter in item) {
        return item[keyOrGetter] as E;
      }
    default:
      return null;
  }
}

export function arrayUnique<T extends Primitive, K extends (T extends object ? keyof T : never), E extends Primitive>(arr: T[], getter?: Getter<T, E>): T[];
export function arrayUnique<T extends object, K extends (T extends object ? keyof T : never), E extends T[K]>(arr: T[], key?: K): T[];
export function arrayUnique<T extends object, K extends (T extends object ? keyof T : never), E extends T[K]|Primitive>(arr: T[], keyOrGetter?: TypeOrGetter<T, K, E>): T[];
export function arrayUnique<T, K extends (T extends object ? keyof T : never), E extends T[K]|Primitive>(arr: T[], keyOrGetter?: TypeOrGetter<T, K, E>): T[] {
  return arr
    .filter(
      (item, index, array) => index === array.findIndex(i => accessProperty(i, keyOrGetter) === accessProperty(item, keyOrGetter))
    );
}
