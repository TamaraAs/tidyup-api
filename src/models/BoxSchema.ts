import { Schema, model, Document, Model } from 'mongoose';

export interface BoxDTO extends Document {
  description: string;
}

export const BoxSchema = new Schema({ casa: String });
export const BoxModel: Model<BoxDTO> = model('Boxes', BoxSchema);
