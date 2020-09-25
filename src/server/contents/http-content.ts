import { OutgoingHttpHeaders } from 'http';

export abstract class HttpContent<T> {
  private _headers: OutgoingHttpHeaders = {};

  public get headers(): OutgoingHttpHeaders {
    return this._headers;
  }

  public abstract readAsync(): Promise<T>;
}
