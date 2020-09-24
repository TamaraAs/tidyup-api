import { Model } from 'mongoose';
import { inject } from 'inversify';
import { BoxSchema, BoxDTO } from '../models/BoxSchema';
import TYPES from '../types';
import { provide } from '../server/decorators';
import { MongodbClient } from './mongodb-client';

export interface BoxRepository {
  findAll(): Promise<BoxDTO[]>;
  save(doc: BoxDTO): Promise<BoxDTO>;
  findById(id: string): Promise<BoxDTO>;
}

@provide(TYPES.BoxRepository)
export class MongooseBoxRepository implements BoxRepository {
  constructor(@inject(TYPES.DBClient) private mongodbClient: MongodbClient) {}

  public async findAll(): Promise<BoxDTO[]> {
    const model: Model<BoxDTO> = await (await this.mongodbClient.connection()).model('Boxes', BoxSchema);
    return new Promise((resolve, reject) => {
      model.find((error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  public async save(doc: BoxDTO): Promise<BoxDTO> {
    const model: Model<BoxDTO> = await (await this.mongodbClient.connection()).model('Boxes', BoxSchema);
    return new Promise((resolve, reject) => {
      const instance = new model(doc);
      instance.save((error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  public async findById(id: string): Promise<BoxDTO> {
    const model: Model<BoxDTO> = await (await this.mongodbClient.connection()).model('Boxes', BoxSchema);
    return new Promise((resolve, reject) => {
      model.findById(id, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }
}
