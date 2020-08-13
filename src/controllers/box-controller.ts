import { Response, Request } from 'express';
import * as boxService from '../services/box-service';

export async function search(_: Request, response: Response): Promise<void> {
  const list = await boxService.search();
  response.json(list).status(200);
}
