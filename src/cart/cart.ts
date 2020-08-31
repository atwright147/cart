import { v1 as uuidv1 } from 'uuid';

import { ICartInput, ICartItem, ICartItemAll } from '../interfaces/cart.interface';

export class Cart {
  private myItems = new Set<ICartItem>();

  get length(): number {
    return this.myItems.size;
  }

  get all(): ICartItemAll {
    const items = Array.from(this.myItems) as ICartItem[];
    const total = this.total;
    return { items, total };
  }

  get total(): number {
    return Array.from(this.myItems)
      .reduce((prev: number, curr: ICartItem) => {
        const currentTotal = Number(curr.price) * Number(curr.quantity);
        return prev + currentTotal;
      }, 0) as number;
  }

  public has(id: number): boolean {
    return !!Array.from(this.myItems)
      .filter((item: ICartItem) => item.id === id).length;
  }

  public getItemById(id: number): ICartItem {
    return Array.from(this.myItems)
      .filter((item: ICartItem) => item.id === id)[0] as ICartItem;
  }

  public getItemByUuid(uuid: string): ICartItem {
    return Array.from(this.myItems)
      .filter((item: ICartItem) => item.uuid === uuid)[0] as ICartItem;
  }

  public add(item: ICartInput): void {
    if (!this.has(item.id)) {
      const itemToAdd: ICartItem = {
        ...item,
        uuid: uuidv1(),
        subTotal: item.quantity * item.price,
      };

      this.myItems.add(itemToAdd);
    } else {
      const itemToUpdate = Array.from(this.myItems)
        .filter((existingItem: ICartItem) => item.id === existingItem.id)[0] as ICartItem;

      itemToUpdate.quantity = itemToUpdate.quantity + item.quantity;
      itemToUpdate.subTotal = itemToUpdate.quantity * itemToUpdate.price;

      this.myItems.add(itemToUpdate);
    }
  }

  public remove(uuid: string): void {
    const itemToRemove = Array.from(this.myItems)
      .filter((item: ICartItem) => item.uuid === uuid)[0];

    this.myItems.delete(itemToRemove);
  }
}
