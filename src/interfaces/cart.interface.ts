export interface ICartItem {
  id: number;
  uuid: string;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface ICartItemAll {
  items: ICartItem[];
  total: number;
}
