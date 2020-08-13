import { Application, Router } from 'express';
import * as boxController from '../controllers/box-controller';

export default (server: Application): void => {
  const router = Router();

  router.get('/boxes', boxController.search);

  server.use('', router);
};
