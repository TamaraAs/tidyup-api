import { HttpContent } from './http-content';

const JSON_MEDIA_TYPE = 'application/json';

export class JsonContent extends HttpContent<string> {
  private content: string;

  constructor(content: unknown) {
    super();
    this.content = JSON.stringify(content);
    this.headers['content-type'] = JSON_MEDIA_TYPE;
  }

  public readAsync(): Promise<string> {
    return Promise.resolve(this.content);
  }
}
