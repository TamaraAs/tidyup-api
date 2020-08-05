import express, {Application} from 'express';

const app: Application = express();

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
