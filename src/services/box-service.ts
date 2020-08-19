import { Box } from '../interfaces/box';
import boxRepository from '../models/box-model';

const search = async (): Promise<Box[]> => {
  const searchedBoxes = await boxRepository.find().exec();
  return searchedBoxes.map((element) => {
    return { id: element._id };
  });
};

const create = async (): Promise<Box> => {
  const findedBox = await boxRepository.create({});
  return { id: findedBox?._id };
};

const findById = async (id: string): Promise<Box> => {
  const findedBox = await boxRepository.findById(id).exec();
  return { id: findedBox?._id };
};

export { search, create, findById };
