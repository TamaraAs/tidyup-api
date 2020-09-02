import { injectable, inject, multiInject } from 'inversify';
import { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import TYPES from '../types';
import { logger } from '../utils/Logger';
import { RegistrableController } from '../controllers/RegistrableController';

@injectable()
export class Server {
  constructor(
    @inject(TYPES.ExpressApplication) private expressApplication: Application,
    @multiInject(TYPES.Controller) private controllers: RegistrableController[]
  ) {
    Server.build(expressApplication, controllers);
  }

  public run(): void {
    const port = 3000;
    this.expressApplication.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
    });
  }

  private static build(expressApplication: Application, controllers: RegistrableController[]): void {
    expressApplication.use(bodyParser.json());

    controllers.forEach((controller) => controller.register(expressApplication));

    expressApplication.use((error: Error, request: Request, response: Response, next: NextFunction) => {
      logger.error(error.stack);
      response.status(500).send('Internal Server Error');
      next(error);
    });

    expressApplication.use((request: Request, response: Response) => {
      response.status(404).send();
    });
  }
}
