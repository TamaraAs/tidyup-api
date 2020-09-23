import { Response, Request } from 'express';
import { controller, httpGet, httpPost, httpPut } from '../server/decorators';

@controller('/boxes')
export class BoxController {
  @httpGet()
  public async getAll(_: Request, response: Response): Promise<void> {
    /*try {
      const boxes = await this.boxService.getBoxes();
      response.status(200).json(boxes);
    } catch (error) {
      next(error);
    }*/
    response.send('GETALL');
  }

  @httpPost()
  public async create(_: Request, response: Response): Promise<void> {
    /*try {
      const { body } = request;
      const box = await this.boxService.create(body);
      response.status(201).json(box);
    } catch (error) {
      next(error);
    }*/
    response.send('CREATE');
  }

  @httpGet('/:id')
  public async getById(_: Request, response: Response): Promise<void> {
    /*try {
      const contentType: string = request.headers['content-type'];
      const { id } = request.params;
      const box = await this.boxService.findById(id);
      if (contentType === 'application/json') {
        response.status(200).json(box);
      } else if (conten= 'image/png') {
        const qrcode = await toBuffer(box.getId());
        response.end(qrcode);
      } else {
        response.status(415).send();
      }
    } catch (error) {
      next(error);
    }*/
    response.send('GETBYID');
  }

  @httpPut('/:id/items')
  public async putItem(_: Request, response: Response): Promise<void> {
    /*try {
      const { id } = request.params;
      const body = request.body;
      const item = new Item(body.name);
      const box = await this.boxService.addItem(id, item);
      onse.status(201).json(box);
    } catch (error) {
      next(error);
    }*/
    response.send('PUTITEM');
  }
}
