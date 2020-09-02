import { Server } from './Server';
import { Container } from 'inversify';
import express, { Application } from 'express';
import containerModule from '../inversify.config';
import TYPES from '../types';
import { createClient, DBClient } from '../utils/DBClient';

export async function bootstrap(): Promise<Server> {
  const container: Container = new Container();

  const expressApp: Application = express();
  container.bind<Application>(TYPES.ExpressApplication).toConstantValue(expressApp);

  const dbClient = await createClient('mongodb://localhost:27017/test');
  container.bind<DBClient>(TYPES.DBClient).toConstantValue(dbClient);

  container.load(containerModule);
  const serverInstance = container.get<Server>(TYPES.Server);

  return serverInstance;
}
