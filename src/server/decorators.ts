import { decorate, injectable } from 'inversify';
import { METADATA_KEY } from './constants';

type MethodDecorator = (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void;

export const controller = (path = '') => {
  return (target: unknown): void => {
    const currentMetadata = { path, target };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    const previousMetadata: unknown[] = Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];
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

export const httpMethod = (method: string, path = '') => {
  return (target: unknown, propertyKey: string): void => {
    const metadata = { method, path, target, propertyKey };
    const metadataList = Reflect.getMetadata(METADATA_KEY.controllerMethod, target.constructor) || [];
    metadataList.push(metadata);
    Reflect.defineMetadata(METADATA_KEY.controllerMethod, metadataList, target.constructor);
  };
};
