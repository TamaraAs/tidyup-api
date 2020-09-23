export interface ControllerMetadata {
  path: string;
  target: unknown;
}

export interface ControllerMethodMetadata extends ControllerMetadata {
  method: string;
  propertyKey: string;
}
