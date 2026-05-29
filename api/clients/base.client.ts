import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
  constructor(private readonly request: APIRequestContext) {}

  get(endpoint: string, params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.request.get(endpoint, { params });
  }

  post(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.post(endpoint, { data });
  }

  put(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.put(endpoint, { data });
  }

  patch(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.patch(endpoint, { data });
  }

  delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint);
  }
}
