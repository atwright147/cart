import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as uuid from 'uuid';

import { Cart } from './cart';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  describe('get length()', () => {
    it('should return the correct number', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      expect(cart.length).toEqual(2);
    });
  });

  describe('get all()', () => {
    it('should return all items', () => {
      vi.spyOn(uuid, 'v1').mockReturnValue('1111');
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      const expected = {
        items: [
          { id: 1, name: 'Item 1', quantity: 1, price: 10, subTotal: 10, uuid: '1111' },
          { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10, uuid: '1111' },
        ],
        total: 20,
      };

      expect(cart.all).toEqual(expected);
    });
  });

  describe('get total()', () => {
    it('should return the total value of the cart', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 3, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 2, price: 10 });

      expect(cart.total).toEqual(50);
    });
  });

  describe('has()', () => {
    describe('given a UUID', () => {
      it('should return boolean true if item exists', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        const uuid = cart.all.items[1].uuid;

        expect(cart.has({ uuid })).toEqual(true);
      });

      it('should return boolean false if item does not exist', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ uuid: 'made-up-uuid' })).toEqual(false);
      });
    });

    describe('given an ID', () => {
      it('should return boolean true if item exists', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ id: 2 })).toEqual(true);
      });

      it('should return boolean false if item does not exist', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ id: 3 })).toEqual(false);
      });
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      let count: number = 0;

      // a bit hacky but it works
      vi.spyOn(uuid, 'v1').mockImplementation(() => {
        let value: string;
        switch (count) {
          case 0:
            value = '1111';
            break;
          case 1:
            value = '2222';
            break;
          case 2:
            value = '3333';
            break;
          default:
            value = '0000';
            break;
        }

        count += 1;
        return value;
      });

      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
      cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
    });

    describe('given a UUID', () => {
      it('should return the correct item', () => {
        const uuid = cart.all.items[1].uuid;

        const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10, uuid };
        expect(cart.get({ uuid })).toEqual(expected);
      });

      it('should return null if the item does not exist', () => {
        expect(cart.get({ uuid: 'made-up-uuid' })).toEqual(null);
      });
    });

    describe('given an ID', () => {
      it('should return the correct item', () => {
        const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10, uuid: '2222' };
        expect(cart.get({ id: 2 })).toEqual(expected);
      });

      it('should return null if the item does not exist', () => {
        expect(cart.get({ id: 42 })).toEqual(null);
      });
    });
  });

  describe('add()', () => {
    it('should generate a uuid', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });

      expect(uuid.validate(cart.all.items[0].uuid)).toBe(true);
    });

    describe('given the item is already present in the cart', () => {
      it('should update the quantity of the existing item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 1, name: 'Item 1', quantity: 3, price: 10 });
        const uuid = cart.all.items[0].uuid;

        expect(cart.get({ uuid })).toHaveProperty('quantity', 4);
      });

      it('should calculate and overwrite the sub-total', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 1, name: 'Item 1', quantity: 2, price: 10 });

        expect(cart.all.items[0]).toHaveProperty('subTotal', 30);
      });
    });

    describe('given the item is not already present in the cart', () => {
      it('should add a new item', () => {
        expect(cart.length).toEqual(0);
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        expect(cart.length).toEqual(1);
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        expect(cart.length).toEqual(2);
      });

      it('should calculate and append a sub-total', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 2, price: 10 });

        expect(cart.all.items[0]).toHaveProperty('subTotal', 20);
      });
    });
  });

  describe('remove()', () => {
    describe('given a UUID', () => {
      it('should remove an item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
        const uuid = cart.all.items[1].uuid;

        cart.remove({ uuid });
        expect(cart.length).toEqual(2);
      });
    });

    describe('given an ID', () => {
      it('should remove an item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });

        cart.remove({ id: 2 });
        expect(cart.length).toEqual(2);
      });
    });
  });
});
