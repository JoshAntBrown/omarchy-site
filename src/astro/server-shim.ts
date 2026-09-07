// Resolve-only stand-in for the deleted TanStack server packages. Nothing
// in the build calls these; the stub exists so unbuilt modules (src/parked)
// keep resolving in the dev dependency scan.
type Chainable = {
  (...args: never[]): Promise<never>
  middleware: (...args: never[]) => Chainable
  validator: (...args: never[]) => Chainable
  handler: (...args: never[]) => Chainable
}

function chain(): Chainable {
  const fn = (async () => {
    throw new Error('TanStack server functions are deleted')
  }) as Chainable
  fn.middleware = () => fn
  fn.validator = () => fn
  fn.handler = () => fn
  return fn
}

export function createServerFn(_opts?: unknown): Chainable {
  return chain()
}

export const staticFunctionMiddleware = {}
