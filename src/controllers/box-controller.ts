import { Response, Request } from 'express';
import { inject } from 'inversify';
import { toBuffer } from 'qrcode';
import { Item } from '../models/Item';
import { controller, httpGet, httpPost, httpPut } from '../server/decorators';
import { BoxService } from '../services/box-service';
import TYPES from '../types';

@controller('/boxes')
export class BoxController {
  constructor(@inject(TYPES.BoxService) private boxService: BoxService) {}

  @httpGet()
  public async getAll(_: Request, response: Response): Promise<void> {
    const boxes = await this.boxService.getBoxes();
    response.status(200).json(boxes);
  }

  @httpPost()
  public async create(request: Request, response: Response): Promise<void> {
    const { body } = request;
    const box = await this.boxService.create(body);
    response.status(201).json(box);
  }

  @httpGet('/:id')
  public async getById(request: Request, response: Response): Promise<void> {
    const accept: string = request.headers['accept'];
    const { id } = request.params;
    const box = await this.boxService.findById(id);
    if (accept === 'application/json') {
      response.status(200).json(box);
    } else if (accept === 'image/png') {
      const qrcode = await toBuffer(box.getId());
      response.end(qrcode);
    } else {
      response.status(406).send();
    }
  }

  @httpPut('/:id/items')
  public async putItem(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const body = request.body;
    const item = new Item(body.name);
    const box = await this.boxService.addItem(id, item);
    response.status(201).json(box);
  }
}
