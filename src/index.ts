import { bootstrap } from './server/Bootstrap';

async function runServer() {
  const server = await bootstrap();
  server.run();
}

runServer();
