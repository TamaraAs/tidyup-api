import { JsonContent } from '../contents/json-content';
import { HttpResponse } from '../http-response';
import { HttpActionResult } from '../interfaces';

export class OkNegotiatedContentResult<T> implements HttpActionResult<string> {
  public constructor(private content: T) {}

  public async executeAsync(): Promise<HttpResponse<string>> {
    const response = new HttpResponse<string>();
    response.content = new JsonContent(this.content);
    return response;
  }
}
