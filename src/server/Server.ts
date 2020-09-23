import express, { Application, Router } from 'express';
import { Container } from 'inversify';
import { METADATA_KEY, TYPE } from './constants';

export class Server {
  private container: Container;
  private router: Router;
  private app: Application;

  public constructor() {
    this.app = express();
    this.router = Router();
    this.container = new Container();
  }

  public build(): Application {
    this.registerControllers();

    return this.app;
  }

  private registerControllers(): void {
    const constructors = Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];

    constructors
      .map((constructor) => constructor.target)
      .forEach((constructor) => {
        const name = constructor.name;

        this.container.bind(TYPE.Controller).to(constructor).whenTargetNamed(name);
      });

    const controllers = this.container.getAll(TYPE.Controller);
    controllers.forEach((controller) => {
      const controllerMetadata = Reflect.getMetadata(METADATA_KEY.controller, controller.constructor);
      const methodMetadata = Reflect.getMetadata(METADATA_KEY.controllerMethod, controller.constructor);

      methodMetadata.forEach((metadata) => {
        this.router[metadata.method](
          `${controllerMetadata.path}${metadata.path}`,
          metadata.target[metadata.propertyKey]
        );
      });
    });
    this.app.use('', this.router);
  }
}
