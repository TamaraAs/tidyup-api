import 'reflect-metadata';

import { Server } from './server/Server';

async function runServer() {
  const serverBuilder = new Server();
  const server = await serverBuilder.build();
  server.listen(3000, () => {
    console.log('Arrancado');
  });
}

runServer();
