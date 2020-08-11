import express from 'express';
import Logger from './loaders/logger';
import setupExpress from './loaders/express';
import setupMongoose from './loaders/mongoose';

async function start() {
  const port = 3000;
  const server = express();

  setupMongoose();
  setupExpress(server);

  server.listen(port, (error) => {
    if (error) {
      Logger.error(error);
      process.exit(1);
    }

    Logger.info(`Server started on port ${port}`);
  });
}

Logger.info(`Server starting`);
start();
