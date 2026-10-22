import { env } from '@config/env';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * URL matcher for an API endpoint, with or without a query string.
 * `apiRoute('/products')` matches `.../products` and `.../products?page=2`,
 * but not `.../products/123`.
 */
export function apiRoute(path: string): RegExp {
  return new RegExp(`^${escape(env.apiUrl + path)}(\\?.*)?$`);
}
