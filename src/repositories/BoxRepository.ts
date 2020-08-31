import { Model } from 'mongoose';
import { injectable, inject } from 'inversify';
import { BoxSchema, BoxDTO } from '../models/BoxSchema';
import TYPES from '../types';
import { DBClient } from '../utils/DBClient';

export interface BoxRepository {
  findAll(): Promise<BoxDTO[]>;
  save(): Promise<BoxDTO>;
  findById(id: string): Promise<BoxDTO>;
}

@injectable()
export class MongooseBoxRepository implements BoxRepository {
  private model: Model<BoxDTO>;

  constructor(@inject(TYPES.DBClient) private dbClient: DBClient) {
    this.model = dbClient.model('Boxes', BoxSchema);
  }

  public async findAll(): Promise<BoxDTO[]> {
    return new Promise((resolve, reject) => {
      this.model.find((error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  public async save(): Promise<BoxDTO> {
    return new Promise((resolve, reject) => {
      const instance = new this.model();
      instance.save((error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  public async findById(id: string): Promise<BoxDTO> {
    return new Promise((resolve, reject) => {
      this.model.findById(id, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }
}
