// Caching Utilities

export function createCachedFunction<
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  _options: {
    tags: string[];
    revalidate?: number | false;
  },
): T {
  return fn;
}

export function invalidateCacheTag(_tag: string) {
  return;
}

export function invalidateCacheTags(..._tags: string[]) {
  return;
}
