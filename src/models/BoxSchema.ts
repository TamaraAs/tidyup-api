import { Schema, model, Document, Model } from 'mongoose';

export interface ItemDTO {
  name: string;
}

export interface BoxDTO extends Document {
  name: string;
  items: ItemDTO[];
}

export const ItemSchema = new Schema({ name: String });
export const BoxSchema = new Schema({ name: String, items: [ItemSchema] });

export const BoxModel: Model<BoxDTO> = model('Boxes', BoxSchema);
