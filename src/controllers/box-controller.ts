import { Response, Request } from 'express';
import { inject } from 'inversify';
import { toBuffer } from 'qrcode';
import { Box } from '../models/Box';
import { Item } from '../models/Item';
import { BaseController } from '../server/base-controller';
import { controller, httpGet, httpPost, httpPut } from '../server/decorators';
import { HttpActionResult } from '../server/interfaces';
import { BoxService } from '../services/box-service';
import TYPES from '../types';

@controller('/boxes')
export class BoxController extends BaseController {
  constructor(@inject(TYPES.BoxService) private boxService: BoxService) {
    super();
  }

  @httpGet()
  public async getAll(): Promise<Box[]> {
    return await this.boxService.getBoxes();
  }

  @httpPost()
  public async create(request: Request): Promise<HttpActionResult> {
    const { body } = request;
    const box = await this.boxService.create(body);
    return this.created(box);
  }

  @httpGet('/:id')
  public async getById(request: Request): Promise<HttpActionResult | void> {
    const { id } = request.params;
    const box = await this.boxService.findById(id);
    return this.ok(box);
  }

  @httpGet('/:id', { contentType: 'image/png' })
  public async getImageById(request: Request, response: Response): Promise<HttpActionResult | void> {
    const { id } = request.params;
    const box = await this.boxService.findById(id);
    // TODO: Encapsular libreria de 3os
    const qrcode = await toBuffer(box.getId());
    response.end(qrcode);
  }

  @httpPut('/:id/items')
  public async putItem(request: Request): Promise<HttpActionResult> {
    const { id } = request.params;
    const body = request.body;
    const item = new Item(body.name);
    const box = await this.boxService.addItem(id, item);
    return this.ok(box);
  }
}
