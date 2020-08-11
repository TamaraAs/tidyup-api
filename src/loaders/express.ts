import { Application } from 'express';
import routeApiEndpoints from '../api/router';

const routeStatusEndpoints = (server: Application): void => {
  server.get('/status', (_, response) => {
    response.status(200).end();
  });

  server.head('/status', (_, response) => {
    response.status(200).end();
  });
};

export default (server: Application): void => {
  routeStatusEndpoints(server);
  routeApiEndpoints(server);
};
