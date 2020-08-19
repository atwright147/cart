export interface ICartInput {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ICartItem extends ICartInput {
  uuid: string;
  subTotal: number;
}

export interface ICartItemAll {
  items: ICartItem[];
  total: number;
}
