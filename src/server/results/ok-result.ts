import { HttpResponse } from '../http-response';
import { HttpActionResult } from '../interfaces';

export class OkResult implements HttpActionResult<never> {
  public async executeAsync(): Promise<HttpResponse<never>> {
    return new HttpResponse<never>();
  }
}
