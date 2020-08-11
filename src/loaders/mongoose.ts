import mongoose from 'mongoose';
import { Db } from 'mongodb';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect('mongodb://localhost/tidyup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return connection.connection.db;
};
