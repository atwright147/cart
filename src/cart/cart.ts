import { v1 as uuidv1 } from 'uuid';

import { ICartInput, ICartItem, ICartItemAll } from '../interfaces/cart.interface';

type ByIdArg = { id: number, uuid?: never };
type ByUuidArg = { uuid: string, id?: never };
type ByUuidOrId = ByIdArg | ByUuidArg;

export class Cart {
  private myItems = new Set<ICartItem>();

  get length(): number {
    return this.myItems.size;
  }

  get all(): ICartItemAll {
    const { myItems, total } = this;
    const items = [...myItems];
    return { items, total };
  }

  get total(): number {
    let total = 0;
    for (const item of this.myItems) {
      const currentTotal = Number(item.price) * Number(item.quantity);
      total += currentTotal;
    }
    return total;
  }

  public has(arg: ByUuidOrId): boolean {
    return Array.from(this.myItems).some((item: ICartItem) => {
      if (arg.uuid) {
        return item.uuid === arg.uuid;
      } else if (arg.id) {
        return item.id === arg.id;
      }
    });
  }

  public get(arg: ByUuidOrId): ICartItem | null {
    const result = Array.from(this.myItems).find((item: ICartItem) => {
      if (arg.uuid) {
        return item.uuid === arg.uuid;
      } else if (arg.id) {
        return item.id === arg.id;
      }
    });

    return result ?? null;
  }

  public add(item: ICartInput): void {
    const existingItem = Array.from(this.myItems).find(
      (existingItem: ICartItem) => item.id === existingItem.id
    );

    if (!existingItem) {
      const newItem: ICartItem = {
        ...item,
        uuid: uuidv1(),
        subTotal: item.quantity * item.price,
      };

      this.myItems.add(newItem);
    } else {
      existingItem.quantity += item.quantity;
      existingItem.subTotal = existingItem.quantity * existingItem.price;
    }
  }

  public remove(arg: ByUuidOrId): void {
    const itemToRemove = Array.from(this.myItems).find((item: ICartItem) => {
      if (arg.uuid) {
        return item.uuid === arg.uuid;
      } else if (arg.id) {
        return item.id === arg.id;
      }
    });

    if (itemToRemove) {
      this.myItems.delete(itemToRemove);
    }
  }
}
