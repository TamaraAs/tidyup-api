import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

export function createMockResponse(): MockProxy<Response> {
  const mockResponse = mock<Response>();
  mockResponse.json.mockReturnThis();
  mockResponse.status.mockReturnThis();
  return mockResponse;
}

export class RequestBuilder {
  private body: Record<string, unknown>;
  private headers: Record<string, unknown>;
  private params: Record<string, string>;

  withBody(body: Record<string, unknown>): RequestBuilder {
    this.body = body;
    return this;
  }

  withHeaders(headers: Record<string, unknown>): RequestBuilder {
    this.headers = headers;
    return this;
  }

  withParams(params: Record<string, string>): RequestBuilder {
    this.params = params;
    return this;
  }

  build(): Request {
    return {
      body: this.body,
      headers: this.headers,
      params: this.params
    } as Request;
  }
}
