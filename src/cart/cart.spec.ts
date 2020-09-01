/// <reference types="chai-exclude" />
/// <reference types="@types/chai-uuid" />

// tslint:disable:no-var-requires
const chai = require('chai') as Chai.ChaiStatic;
chai.use(require('chai-exclude'));
chai.use(require('chai-uuid'));
// tslint:enable
const expect = chai.expect;

import { Cart } from './cart';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('has', () => {
    describe('given a UUID', () => {
      it('should return boolean true if item exists', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        const uuid = cart.all.items[1].uuid;

        expect(cart.has({ uuid })).to.equal(true);
      });

      it('should return boolean false if item does not exist', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ uuid: 'made-up-uuid' })).to.equal(false);
      });
    });

    describe('given an ID', () => {
      it('should return boolean true if item exists', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ id: 2 })).to.equal(true);
      });

      it('should return boolean false if item does not exist', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

        expect(cart.has({ id: 3 })).to.equal(false);
      });
    });
  });

  describe('add', () => {
    it('should generate a uuid', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });

      // @ts-ignore
      expect(cart.all.items[0].uuid).to.be.a.uuid('v1');
    });

    describe('given the item is already present in the cart', () => {
      it('should update the quantity of the existing item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 1, name: 'Item 1', quantity: 3, price: 10 });
        const uuid = cart.all.items[0].uuid;

        expect(cart.get({ uuid })).to.have.property('quantity', 4);
      });

      it('should calculate and overwrite the sub-total', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 1, name: 'Item 1', quantity: 2, price: 10 });

        expect(cart.all.items[0]).to.have.property('subTotal', 30);
      });
    });

    describe('given the item is not already present in the cart', () => {
      it('should add a new item', () => {
        expect(cart.length).to.equal(0);
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        expect(cart.length).to.equal(1);
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        expect(cart.length).to.equal(2);
      });

      it('should calculate and append a sub-total', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 2, price: 10 });

        expect(cart.all.items[0]).to.have.property('subTotal', 20);
      });
    });
  });

  describe('remove', () => {
    describe('given a UUID', () => {
      it('should remove an item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
        const uuid = cart.all.items[1].uuid;

        cart.remove({ uuid });
        expect(cart.length).to.equal(2);
      });
    });

    describe('given an ID', () => {
      it('should remove an item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
        cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });

        cart.remove({ id: 2 });
        expect(cart.length).to.equal(2);
      });
    });
  });

  describe('get length', () => {
    it('should return the correct number', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      expect(cart.length).to.equal(2);
    });
  });

  describe('get total', () => {
    it('should return the total value of the cart', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 3, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 2, price: 10 });

      expect(cart.total).to.equal(50);
    });
  });

  describe('get all', () => {
    it('should return all items', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      const expected = {
        items: [
          { id: 1, name: 'Item 1', quantity: 1, price: 10, subTotal: 10 },
          { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10 },
        ],
        total: 20,
      };

      expect(cart.all).excludingEvery('uuid').to.deep.equal(expected);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
      cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
    });

    describe('given a UUID', () => {
      it('should return the correct item', () => {
        const uuid = cart.all.items[1].uuid;

        const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10 };
        expect(cart.get({ uuid })).excludingEvery('uuid').to.deep.equal(expected);
      });

      it('should return null if the item does not exist', () => {
        expect(cart.get({ uuid: 'made-up-uuid' })).to.equal(null);
      });
    });

    describe('given an ID', () => {
      it('should return the correct item', () => {
        const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10 };
        expect(cart.get({ id: 2 })).excludingEvery('uuid').to.deep.equal(expected);
      });

      it('should return null if the item does not exist', () => {
        expect(cart.get({ id: 42 })).to.equal(null);
      });
    });
  });
});
