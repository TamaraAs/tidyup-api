import 'reflect-metadata';
import { ContainerModule } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controllers/RegistrableController';
import { BoxController } from './controllers/BoxController';
import { BoxRepository, MongooseBoxRepository } from './repositories/BoxRepository';
import { BoxService, DefaultBoxService } from './services/BoxService';
import { Server } from './server/Server';

export default new ContainerModule((bind) => {
  bind<Server>(TYPES.Server).to(Server).inSingletonScope();

  bind<RegistrableController>(TYPES.Controller).to(BoxController).inSingletonScope();

  bind<BoxService>(TYPES.BoxService).to(DefaultBoxService).inSingletonScope();
  bind<BoxRepository>(TYPES.BoxRepository).to(MongooseBoxRepository).inSingletonScope();
});
