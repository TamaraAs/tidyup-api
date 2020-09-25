import { injectable } from 'inversify';
import { CreatedNegotiatedContentResult } from './results/created-negotiated-content-result';
import { OkNegotiatedContentResult } from './results/ok-negotiated-content-result';
import { OkResult } from './results/ok-result';

@injectable()
export abstract class BaseController {
  protected created<T>(content: T): CreatedNegotiatedContentResult<T> {
    return new CreatedNegotiatedContentResult(content);
  }

  protected ok<T>(content: T): OkNegotiatedContentResult<T>;
  protected ok(): OkResult;
  protected ok<T>(content?: T): OkNegotiatedContentResult<T> | OkResult {
    return content === undefined ? new OkResult() : new OkNegotiatedContentResult(content);
  }
}
