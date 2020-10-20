import bodyParser from 'body-parser';
import express, { Application, Request, Response, NextFunction, RequestHandler, Router } from 'express';
import { Container } from 'inversify';
import { METADATA_KEY, TYPE } from './constants';
import { walk } from '../utils/fs';
import {
  ConfigurationPath,
  ControllerMetadata,
  ControllerMethodMetadata,
  Newable,
  ProviderMetadata
} from './interfaces';
import { HttpResponse } from './http-response';

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
        const handler: RequestHandler = this.createHandler(
          controller,
          metadata.propertyKey,
          metadata.configurationPath
        );
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

  private createHandler(controller: Newable, key: string, configuration: ConfigurationPath): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
      const acceptHeader: string = request.headers['accept'] || 'text/plain';
      const returnContentType: string = configuration.contentType || 'application/json';
      if (acceptHeader !== returnContentType) {
        next();
        return;
      }

      try {
        const returnedValue = await controller[key](request, response, next);
        if (returnedValue instanceof HttpResponse) {
          await this.handleHttpResponse(returnedValue, response);
        } else if (!response.headersSent) {
          response.json(returnedValue);
        }
      } catch (error) {
        next(error);
      }
    };
  }

  private async handleHttpResponse(httpResponse: HttpResponse<unknown | never>, response: Response) {
    if (httpResponse.content !== undefined) {
      response.setHeader('content-type', 'application/json');
      response.status(httpResponse.statusCode).send(httpResponse.content);
    } else {
      response.sendStatus(httpResponse.statusCode);
    }
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
