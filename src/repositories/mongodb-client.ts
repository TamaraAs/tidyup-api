import { connect, Mongoose } from 'mongoose';
import { provide } from '../server/decorators';
import TYPES from '../types';

@provide(TYPES.DBClient)
export class MongodbClient {
  public async connection(): Promise<Mongoose> {
    return await connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true });
  }
}
