import { Item } from './Item';

export class Box {
  constructor(private id: string, private name: string, private items: Item[]) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getItems(): Item[] {
    return this.items;
  }
}
