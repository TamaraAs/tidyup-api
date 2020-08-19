import { Application, Router } from 'express';
import * as boxController from '../controllers/box-controller';

export default (server: Application): void => {
  const router = Router();

  router.get('', boxController.search);
  router.post('', boxController.create);
  router.get('/:id', boxController.findById);
  router.delete('/:id', boxController.remove);

  server.use('/boxes', router);
};
