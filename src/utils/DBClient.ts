import { Mongoose, connect } from 'mongoose';
import { logger } from './Logger';

export type DBClient = Mongoose;

export async function createClient(databaseUrl: string): Promise<DBClient> {
  try {
    return await connect(databaseUrl, { useUnifiedTopology: true, useNewUrlParser: true });
  } catch (error) {
    logger.error(error.message);
  }
}
