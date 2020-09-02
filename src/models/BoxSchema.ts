import { Schema, model, Document, Model } from 'mongoose';

export interface BoxDTO extends Document {
  name: string;
}

export const BoxSchema = new Schema({ name: String });
export const BoxModel: Model<BoxDTO> = model('Boxes', BoxSchema);
