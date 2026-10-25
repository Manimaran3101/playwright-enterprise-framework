import type { APIRequestContext, APIResponse } from '@playwright/test';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface SendOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  /** Expected status (default 200). Any other status throws with the response body. */
  expectedStatus?: number;
}

// Small wrapper around APIRequestContext. If a setup call fails, it throws right away
// with the status and body, so I don't get a strange UI failure later.
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

  /** No status check. For negative tests that check the response themselves. */
  async raw(method: Method, url: string, options: SendOptions = {}): Promise<APIResponse> {
    return this.request[method](url, {
      data: options.data,
      params: options.params,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
    });
  }
}
