import { Box } from '../interfaces/box';
import BoxModel from '../models/box.model';

export default class BoxService {
  public async search(): Promise<Box[]> {
    return await BoxModel.find().exec();
  }
}
