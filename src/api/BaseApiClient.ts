import type { APIRequestContext, APIResponse } from '@playwright/test';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface SendOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  /** Status the caller expects; anything else throws with the response body attached. */
  expectedStatus?: number;
}

/**
 * Thin, typed wrapper over Playwright's APIRequestContext.
 * Happy-path helpers fail fast with a readable error, so a broken setup call
 * never surfaces later as a confusing UI failure.
 */
export abstract class BaseApiClient {
  protected token?: string;

  constructor(protected readonly request: APIRequestContext) {}

  withToken(token: string): this {
    this.token = token;
    return this;
  }

  protected async send<T>(method: Method, url: string, options: SendOptions = {}): Promise<T> {
    const response = await this.raw(method, url, options);
    const expected = options.expectedStatus ?? 200;
    if (response.status() !== expected) {
      throw new Error(
        `${method.toUpperCase()} ${url} → expected ${expected}, got ${response.status()}\n` +
          (await response.text()).slice(0, 500),
      );
    }
    return response.status() === 204 ? (undefined as T) : ((await response.json()) as T);
  }

  /** Unchecked call for negative tests that assert on the response themselves. */
  async raw(method: Method, url: string, options: SendOptions = {}): Promise<APIResponse> {
    return this.request[method](url, {
      data: options.data,
      params: options.params,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
    });
  }
}
