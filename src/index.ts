import express, {Application} from 'express';

const app: Application = express();

app.get('/', function (request, response) {
  response.send('Hello world');
});

app.listen(3000, function () {
  console.log('App is listening on port 3000');
});
