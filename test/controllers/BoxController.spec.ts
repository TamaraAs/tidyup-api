import 'reflect-metadata';
import { NextFunction, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { createMockResponse, RequestBuilder } from '../TestUtils';
import { BoxService } from '../services/box-service';
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

      const request = new RequestBuilder().build();
      await boxController.getAll(request, mockResponse, mock());

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedItems);
    });

    it('getAll on fail search call next with error', async () => {
      const error = new Error('dummy error');
      mockService.getBoxes.mockRejectedValue(error);

      const request = new RequestBuilder().build();
      await boxController.getAll(request, mockResponse, mockNextFN);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNextFN).toHaveBeenCalledWith(error);
    });
  });

  describe('create method', () => {
    it('create on success insert return item created', async () => {
      const expectedBox: Box = new Box('dummy', 'dummy name');
      mockService.create.mockResolvedValue(expectedBox);

      const request = new RequestBuilder().withBody({ item: 'value' }).build();
      await boxController.create(request, mockResponse, mockNextFN);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedBox);
    });

    it('create on fail insert call next with error', async () => {
      const error = new Error('dummy error');
      mockService.create.mockRejectedValue(error);

      const request = new RequestBuilder().withBody({ item: 'value' }).build();
      await boxController.create(request, mockResponse, mockNextFN);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNextFN).toHaveBeenCalledWith(error);
    });
  });

  describe('getById method', () => {
    it('getById with content-type application/json, on success search, return item', async () => {
      const expectedBox: Box = new Box('dummy', 'dummy name');
      mockService.findById.mockResolvedValue(expectedBox);

      const request = new RequestBuilder()
        .withHeaders({
          'content-type': 'application/json'
        })
        .withParams({
          id: 'id-dummy'
        })
        .build();
      await boxController.getById(request, mockResponse, mockNextFN);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedBox);
      expect(mockResponse.end).not.toHaveBeenCalled();
    });

    it('getById with content-type image/png, on success search, return item stream', async () => {
      const expectedBox: Box = new Box('dummy', 'dummy name');
      mockService.findById.mockResolvedValue(expectedBox);

      const request = new RequestBuilder()
        .withHeaders({
          'content-type': 'image/png'
        })
        .withParams({
          id: 'id-dummy'
        })
        .build();
      await boxController.getById(request, mockResponse, mockNextFN);

      expect(mockResponse.end).toHaveBeenCalled(); // TODO: When refactor qrcode improve test.
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('getById with no register content-type, return 415 http error code', async () => {
      const request = new RequestBuilder()
        .withHeaders({
          'content-type': 'dummy'
        })
        .withParams({
          id: 'dummy-id'
        })
        .build();
      await boxController.getById(request, mockResponse, mockNextFN);

      expect(mockResponse.status).toHaveBeenCalledWith(415);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('getById with valid content-type, on failed search, call next with error', async () => {
      const error = new Error('dummy error');
      mockService.findById.mockRejectedValue(error);

      const request = new RequestBuilder()
        .withHeaders({
          'content-type': 'application/json'
        })
        .withParams({
          id: 'dummy-id'
        })
        .build();
      await boxController.getById(request, mockResponse, mockNextFN);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNextFN).toHaveBeenCalledWith(error);
    });
  });
});
