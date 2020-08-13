import { Application } from 'express';
import routeApiEndpoints from '../routes/box-route';

const routeStatusEndpoints = (server: Application): void => {
  server.get('/status', (_, response) => {
    response.status(200).end();
  });

  server.head('/status', (_, response) => {
    response.status(200).end();
  });
};

const setupNotFoundError = (server: Application): void => {
  server.use((_, response) => {
    response.status(404).send();
  });
};

export default (server: Application): void => {
  routeStatusEndpoints(server);
  routeApiEndpoints(server);

  setupNotFoundError(server);
};
