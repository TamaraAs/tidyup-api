import { readdir, stat, Stats } from 'fs';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import express, { Application, Request, Response, NextFunction, RequestHandler, Router } from 'express';
import { Container } from 'inversify';
import { METADATA_KEY, TYPE } from './constants';
import { ControllerMetadata, ControllerMethodMetadata, Newable, ProviderMetadata } from './interfaces';

// TODO: Utilidades de sistema, no deben estar aqui.
const pify = <T>(fn) => (...args) =>
  new Promise<T>((resolve, reject) => {
    fn(...args, (err: NodeJS.ErrnoException | null, result: T) => (err ? reject(err) : resolve(result)));
  });
const readDir = pify<string[]>(readdir);
const statPath = pify<Stats>(stat);
const walk = async (dir: string): Promise<string[]> => {
  let resultList: string[] = [];
  const files = await readDir(dir);
  await Promise.all(
    files.map(async (file) => {
      const resolvedFile = resolve(`${dir}/${file}`);
      const stats = await statPath(resolvedFile);
      if (stats.isDirectory()) {
        const walkResult = await walk(resolvedFile);
        resultList = [...resultList, ...walkResult];
      } else {
        resultList = [...resultList, resolvedFile];
      }
    })
  );
  return resultList;
};

export class Server {
  private container: Container;
  private router: Router;
  private app: Application;

  public constructor() {
    this.app = express();
    this.router = Router();
    this.container = new Container();
  }

  public async build(): Promise<Application> {
    await this.bindProviders();
    this.loadGlobalMiddleware();
    this.registerControllers();

    return this.app;
  }

  private loadGlobalMiddleware(): void {
    this.app.use(bodyParser.json());
  }

  // TODO: La carga de dependencias debe ser llamada desde el server pero es responsabilidad de otro.
  private async bindProviders(): Promise<void> {
    const files = await walk('src');
    await Promise.all(files.map(async (file) => await require(file)));

    const providerMetadataList: ProviderMetadata[] = Reflect.getMetadata(METADATA_KEY.provider, Reflect) || [];
    providerMetadataList.forEach((metadata) => {
      this.container.bind(metadata.type).to(metadata.target);
    });

    const controllerClassMetadataList = this.getControllerClassMetadata();
    controllerClassMetadataList.forEach((controllerClassMetadata) => {
      const name = controllerClassMetadata.target.name;

      this.container.bind(TYPE.Controller).to(controllerClassMetadata.target).whenTargetNamed(name);
    });
  }

  private registerControllers(): void {
    const controllers: Newable[] = this.container.getAll(TYPE.Controller);
    controllers.forEach((controller) => {
      const controllerInstanceMetadata = this.getControllerMetadata(controller.constructor);
      const controllerMethodMetadata = this.getControllerMethodMetadata(controller.constructor);

      controllerMethodMetadata.forEach((metadata) => {
        const handler: RequestHandler = this.createHandler(controller, metadata.propertyKey);
        this.router[metadata.method](`${controllerInstanceMetadata.path}${metadata.path}`, handler);
        // TODO: Añadir logica para establecer metodos no permitidos al termino del registro.
        //this.router.all(`${controllerInstanceMetadata.path}${metadata.path}`, this.createMethodNotAllowedMiddleware());
      });
    });
    this.app.use('', this.router);
    this.app.use(this.createNotFoundMiddleware());
  }

  private getControllerClassMetadata(): ControllerMetadata[] {
    return Reflect.getMetadata(METADATA_KEY.controller, Reflect);
  }

  private getControllerMetadata(target: unknown): ControllerMetadata {
    return Reflect.getMetadata(METADATA_KEY.controller, target);
  }

  private getControllerMethodMetadata(target: unknown): ControllerMethodMetadata[] {
    return Reflect.getMetadata(METADATA_KEY.controllerMethod, target);
  }

  private createHandler(controller: Newable, key: string): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        return await controller[key](request, response, next);
      } catch (error) {
        next(error);
      }
    };
  }

  private createNotFoundMiddleware(): RequestHandler {
    return (_, response: Response): void => {
      response.status(404).send();
    };
  }

  private createMethodNotAllowedMiddleware(): RequestHandler {
    return (_, response: Response): void => {
      response.status(405).send();
    };
  }
}
