import { Application, Request, Response, IRoute, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { RegistrableController } from './RegistrableController';
import { BoxService } from '../services/BoxService';
import TYPES from '../types';

@injectable()
export class BoxController implements RegistrableController {
  constructor(@inject(TYPES.BoxService) private boxService: BoxService) {}

  public register(app: Application): void {
    const routeBoxes: IRoute = app.route('/boxes');
    routeBoxes.get(this.getAll.bind(this));
    routeBoxes.post(this.create.bind(this));
    const routeBox: IRoute = app.route('/boxes/:id');
    routeBox.get(this.getById.bind(this));
  }

  public async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const boxes = await this.boxService.getBoxes();
      response.status(200).json(boxes);
    } catch (error) {
      next(error);
    }
  }

  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const box = await this.boxService.create();
      response.status(201).json(box);
    } catch (error) {
      next(error);
    }
  }

  public async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = request.param('id');
      const box = await this.boxService.findById(id);
      response.status(200).json(box);
    } catch (error) {
      next(error);
    }
  }
}
