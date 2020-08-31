import 'reflect-metadata';
import { ContainerModule } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controllers/RegistrableController';
import { BoxController } from './controllers/BoxController';
import { BoxRepository, MongooseBoxRepository } from './repositories/BoxRepository';
import { BoxService, DefaultBoxService } from './services/BoxService';

export default new ContainerModule((bind) => {
  bind<RegistrableController>(TYPES.Controller).to(BoxController);

  bind<BoxService>(TYPES.BoxService).to(DefaultBoxService);
  bind<BoxRepository>(TYPES.BoxRepository).to(MongooseBoxRepository);
});
