import { injectable, inject } from 'inversify';
import { Box } from '../models/Box';
import { BoxRepository } from '../repositories/BoxRepository';
import TYPES from '../types';
import { BoxDTO } from '../models/BoxSchema';

export interface BoxService {
  getBoxes(): Promise<Box[]>;
  create(): Promise<Box>;
  findById(id: string): Promise<Box>;
}

@injectable()
export class DefaultBoxService implements BoxService {
  constructor(@inject(TYPES.BoxRepository) private boxRepository: BoxRepository) {}

  public async getBoxes(): Promise<Box[]> {
    const dtos = await this.boxRepository.findAll();
    return dtos.map((dto) => this.toBox(dto));
  }

  public async create(): Promise<Box> {
    const dto = await this.boxRepository.save();
    return this.toBox(dto);
  }

  public async findById(id: string): Promise<Box> {
    const dto = await this.boxRepository.findById(id);
    return this.toBox(dto);
  }

  private toBox(dto: BoxDTO): Box {
    return new Box(dto._id);
  }
}
