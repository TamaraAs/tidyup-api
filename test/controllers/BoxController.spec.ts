import 'reflect-metadata';
import { NextFunction, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { createRequest, createMockResponse } from '../TestUtils';
import { BoxService } from '../../src/services/BoxService';
import { BoxController } from '../../src/controllers/BoxController';
import { Box } from '../../src/models/Box';

describe('BoxController unit tests', () => {
  let mockResponse: MockProxy<Response>;
  let mockNextFN: jest.Mock<NextFunction>;
  let mockService: MockProxy<BoxService>;
  let boxController: BoxController;

  beforeEach(() => {
    mockResponse = createMockResponse();
    mockNextFN = jest.fn();
    mockService = mock<BoxService>();
    boxController = new BoxController(mockService);
  });

  describe('getAll method', () => {
    it('getAll on success search return found items', async () => {
      const expectedItems: Box[] = [];
      mockService.getBoxes.mockResolvedValue(expectedItems);

      await boxController.getAll(createRequest(), mockResponse, mock());

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedItems);
    });

    it('getAll on fail search call next with error', async () => {
      const error = new Error('dummy error');
      mockService.getBoxes.mockRejectedValue(error);

      await boxController.getAll(createRequest(), mockResponse, mockNextFN);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNextFN).toHaveBeenCalledWith(error);
    });
  });
});
