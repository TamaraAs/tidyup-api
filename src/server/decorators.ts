import { decorate, injectable } from 'inversify';
import { METADATA_KEY } from './constants';
import {
  Newable,
  ControllerMetadata,
  ControllerMethodMetadata,
  ServiceIdentifier,
  ProviderMetadata
} from './interfaces';

export const controller = (path = '') => {
  return (target: Newable): void => {
    const currentMetadata: ControllerMetadata = { path, target };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    const previousMetadata: ControllerMetadata[] = Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];
    const newMetadata = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
  };
};

export const httpGet = (path?: string): MethodDecorator => {
  return httpMethod('get', path);
};

export const httpPost = (path?: string): MethodDecorator => {
  return httpMethod('post', path);
};

export const httpPut = (path?: string): MethodDecorator => {
  return httpMethod('put', path);
};

export const httpPatch = (path?: string): MethodDecorator => {
  return httpMethod('patch', path);
};

export const httpHead = (path?: string): MethodDecorator => {
  return httpMethod('head', path);
};

export const httpDelete = (path?: string): MethodDecorator => {
  return httpMethod('delete', path);
};

export const httpMethod = (method: string, path = ''): MethodDecorator => {
  return (target: Newable, propertyKey: string): void => {
    const metadata: ControllerMethodMetadata = { method, path, target, propertyKey };
    const metadataList: ControllerMethodMetadata[] =
      Reflect.getMetadata(METADATA_KEY.controllerMethod, target.constructor) || [];
    metadataList.push(metadata);
    Reflect.defineMetadata(METADATA_KEY.controllerMethod, metadataList, target.constructor);
  };
};

export const provide = (type: ServiceIdentifier) => {
  return (target: Newable): void => {
    const metadata: ProviderMetadata = { type, target };
    decorate(injectable(), target);
    const previousMetadata: ProviderMetadata[] = Reflect.getMetadata(METADATA_KEY.provider, Reflect) || [];
    const newMetadata = [metadata, ...previousMetadata];
    Reflect.defineMetadata(METADATA_KEY.provider, newMetadata, Reflect);
  };
};
