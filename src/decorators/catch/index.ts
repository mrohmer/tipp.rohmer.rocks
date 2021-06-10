import * as SentryNode from '@sentry/node';

type HandlerFunction<R, T, E = Error> = (error: Error, ctx: T) => false | R;

const _handleError = <T, R, E = Error>(ctx: T, handler: HandlerFunction<R, T>, error: E) => {
  // Check if error is instance of given error type
  if (typeof handler === 'function') {
    // Run handler with error object and class context
    const handled = handler.call(null, error, ctx);

    if (handled) {
      return handled;
    }
  }

  // Throw error further
  // Next decorator in chain can catch it
  throw error;
};
export const Catch = <T, R>(handler: HandlerFunction<R, T>): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Save a reference to the original method
    const originalMethod = descriptor.value;

    // Rewrite original method with try/catch wrapper
    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        // Check if method is asynchronous
        if (result && result instanceof Promise) {
          // Return promise
          return result.catch((error: any) => _handleError(this, handler, error));
        }

        // Return actual result
        return result;
      } catch (error) {
        return _handleError(this, handler, error);
      }
    };

    return descriptor;
  };
};

