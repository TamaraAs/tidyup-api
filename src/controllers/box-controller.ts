import { Response, Request } from 'express';
import * as boxService from '../services/box-service';

const search = async (_: Request, response: Response): Promise<void> => {
  const list = await boxService.search();
  response.json(list).status(200);
};

const create = async (_: Request, response: Response): Promise<void> => {
  const createdBox = await boxService.create();
  response.json(createdBox).status(201);
};

const findById = async (request: Request, response: Response): Promise<void> => {
  const { id } = request.params;
  const findedBox = await boxService.findById(id);
  response.json(findedBox).status(200);
};

const remove = (): void => {
  return;
};

export { search, create, findById, remove };
