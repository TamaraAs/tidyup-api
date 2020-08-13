import mongoose, { Schema } from 'mongoose';
import { Box } from '../interfaces/box';

const boxModel = new Schema({});

export default mongoose.model<Box & mongoose.Document>('boxes', boxModel);
