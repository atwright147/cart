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

  public has(arg: ByUuidOrId): boolean {
    let result = false;

    /* istanbul ignore else */
    if (arg.uuid) {
      result = !!Array.from(this.myItems)
        .filter((item: ICartItem) => item.uuid === arg.uuid).length;
    } else if (arg.id) {
      result = !!Array.from(this.myItems)
        .filter((item: ICartItem) => item.id === arg.id).length;
    }

    return result;
  }

  public get(arg: ByUuidOrId): ICartItem | null {
    let result: ICartItem | null = null;

    /* istanbul ignore else */
    if (arg.uuid) {
      result = Array.from(this.myItems)
        .filter((item: ICartItem) => item.uuid === arg.uuid)[0] as ICartItem;
    } else if (arg.id) {
      result = Array.from(this.myItems)
        .filter((item: ICartItem) => item.id === arg.id)[0] as ICartItem;
    }

    return typeof result === 'undefined' ? null : result;
  }

  public add(item: ICartInput): void {
    if (!this.has({ id: item.id })) {
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

  public remove(arg: ByUuidOrId): void {
    let itemToRemove: ICartItem | null = null;

    /* istanbul ignore else */
    if (arg.uuid) {
      itemToRemove = Array.from(this.myItems)
        .filter((item: ICartItem) => item.uuid === arg.uuid)[0];
    } else if (arg.id) {
      itemToRemove = Array.from(this.myItems)
        .filter((item: ICartItem) => item.id === arg.id)[0];
    }

    /* istanbul ignore else */
    if (itemToRemove) {
      this.myItems.delete(itemToRemove);
    }
  }
}
