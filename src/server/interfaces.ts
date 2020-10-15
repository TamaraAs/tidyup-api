import { interfaces } from 'inversify';
import { HttpResponse } from './http-response';

export type Newable<T = unknown> = interfaces.Newable<T>;
export type ServiceIdentifier<T = unknown> = interfaces.ServiceIdentifier<T>;

export interface ProviderMetadata {
  type: ServiceIdentifier;
  target: Newable;
}

export interface ControllerMetadata {
  path: string;
  target: Newable;
}

export interface ControllerMethodMetadata {
  path: string;
  method: string;
  propertyKey: string;
  target: Newable;
  configurationPath: ConfigurationPath;
}

export interface HttpActionResult<T = unknown> {
  executeAsync(): Promise<HttpResponse<T>>;
}

export interface ConfigurationPath {
  contentType?: string;
}
