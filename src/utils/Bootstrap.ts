import { Container, ContainerModule } from 'inversify';
import TYPES from '../types';
import { DBClient, createClient } from './DBClient';

export async function bootstrap(container: Container, ...modules: ContainerModule[]): Promise<void> {
  if (container.isBound(TYPES.DBClient) === false) {
    const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/tidyup';
    const dbClient = await createClient(databaseUrl);

    container.bind<DBClient>(TYPES.DBClient).toConstantValue(dbClient);
    container.load(...modules);
  }
}
