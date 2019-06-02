import * as uuid from 'node-uuid';

import { ICartItem } from '../interfaces/cart-item.interface';

export class Cart {
  private myItems = new Set();

  get length(): number {
    return this.myItems.size;
  }

  get all(): ICartItem[] {
    return Array.from(this.myItems) as ICartItem[];
  }

  get total(): number {
    return Array.from(this.myItems)
      .reduce((prev: number, curr: ICartItem) => {
        const currentTotal = Number(curr.price) * Number(curr.quantity);
        return prev + currentTotal;
      }, 0) as number;
  }

  has(id: number): boolean {
    return !!Array.from(this.myItems)
      .filter((item: ICartItem) => item.id === id).length;
  }

  getItemById(id: number): ICartItem {
    return Array.from(this.myItems)
      .filter((item: ICartItem) => item.id === id)[0] as ICartItem;
  }

  getItemByUuid(uuid: string): ICartItem {
    return Array.from(this.myItems)
      .filter((item: ICartItem) => item.uuid === uuid)[0] as ICartItem;
  }

  add(item: ICartItem): void {
    if (!this.has(item.id)) {
      item.uuid = uuid.v1();
      this.myItems.add(item);
    } else {
      const itemToUpdate = Array.from(this.myItems)
        .filter((existingItem: ICartItem) => item.id === existingItem.id)[0] as ICartItem;

      itemToUpdate.quantity = itemToUpdate.quantity + item.quantity;

      this.myItems.add(itemToUpdate)
    }
  }

  remove(uuid: string): void {
    const itemToRemove = Array.from(this.myItems)
      .filter((item: ICartItem) => item.uuid === uuid)[0];

    this.myItems.delete(itemToRemove);
  }
}
