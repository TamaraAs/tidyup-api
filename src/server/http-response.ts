import { HttpContent } from './contents/http-content';

export class HttpResponse<T = unknown> {
  private _statusCode: number;
  private _content: HttpContent<T>;

  public constructor(statusCode = 200) {
    this.statusCode = statusCode;
  }

  public get statusCode(): number {
    return this._statusCode;
  }

  public set statusCode(statusCode: number) {
    this._statusCode = statusCode;
  }

  public get content(): HttpContent<T> {
    return this._content;
  }

  public set content(content: HttpContent<T>) {
    this._content = content;
  }
}
