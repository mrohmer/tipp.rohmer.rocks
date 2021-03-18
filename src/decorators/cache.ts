import {CacheService} from '../services/cache.service';
import objectHash from 'object-hash';

const buildCacheKey = (prefix: string, ...args: any[]) => `${prefix}--${objectHash(args)}`;

export const Cached = (prefix: string, config?: { ttl?: number }) => <T>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args) => Promise<T>>) => {
  const cacheService = new CacheService(config.ttl ?? 60 * 1000);
  const originalMethod = descriptor.value;

  descriptor.value = (...args): Promise<T> => cacheService.get(buildCacheKey(prefix, ...args), (): Promise<T> => originalMethod(...args))

  return descriptor;
}
