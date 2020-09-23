import 'reflect-metadata';
import './controllers';

import { Server } from './server/Server';

new Server().build().listen(3000, () => {
  console.log('Arrancado');
});
