import { Application, Router } from 'express';
import BoxService from '../services/box.service';

export default (server: Application): void => {
  const boxService = new BoxService();
  const router = Router();

  router.get('/boxes', async (_, response) => {
    const list = await boxService.search();
    response.json(list).status(200);
  });

  server.use('', router);
};
