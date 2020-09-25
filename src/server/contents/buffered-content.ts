import { HttpContent } from './http-content';

export class BufferedContent extends HttpContent<Buffer> {
  public constructor(private content: Buffer, private mediaType: string) {
    super();
    this.headers['content-type'] = mediaType;
  }

  public async readAsync(): Promise<Buffer> {
    return Promise.resolve(this.content);
  }
}
