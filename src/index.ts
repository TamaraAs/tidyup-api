import express, { Application, Request, Response, NextFunction } from 'express';
import TYPES from './types';
import containerModule from './inversify.config';
import { RegistrableController } from './controllers/RegistrableController';
import { logger } from './utils/Logger';
import { bootstrap } from './utils/Bootstrap';
import { Container } from 'inversify';

async function runServer() {
  const container = new Container();
  await bootstrap(container, containerModule);

  const app: Application = express();

  const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
  controllers.forEach((controller) => controller.register(app));

  app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    logger.error(error.stack);
    response.status(500).send('Internal Server Error');
    next(error);
  });

  app.use((request: Request, response: Response) => {
    response.status(404).send();
  });

  app.listen(3000, () => {
    logger.info('Server listening on port 3000');
  });
}

runServer();
