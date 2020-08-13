import { Box } from '../interfaces/box';
import boxRepository from '../models/box-model';

export async function search(): Promise<Box[]> {
  const searchedBoxes = await boxRepository.find().lean().exec();
  return searchedBoxes.map((element) => {
    return { id: element._id };
  });
}
