import { Application, Router } from 'express';

export default (server: Application): void => {
  const router = Router();

  router.get('/boxes', (_, response) => {
    response.json([{ id: '123' }]).status(200);
  });

  server.use('', router);
};
