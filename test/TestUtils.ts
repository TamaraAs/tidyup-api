import { Request, Response, NextFunction } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

export function createRequest(): Request {
  return {} as Request;
}

export function createMockResponse(): MockProxy<Response> {
  const mockResponse = mock<Response>();
  mockResponse.json.mockReturnThis();
  mockResponse.status.mockReturnThis();
  return mockResponse;
}
