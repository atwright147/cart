// tslint:disable:no-var-requires
const chai = require('chai');
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
    it('should return boolean true if item exists', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      expect(cart.has(2)).to.equal(true);
    });

    it('should return boolean false if item does not exist', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });

      expect(cart.has(3)).to.equal(false);
    });
  });

  describe('add', () => {
    it('should generate a uuid', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });

      expect(cart.all.items[0].uuid).to.be.a.uuid('v1');
    });

    describe('given the item is already present in the cart', () => {
      it('should update the quantity of the existing item', () => {
        cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
        cart.add({ id: 1, name: 'Item 1', quantity: 3, price: 10 });
        const uuid = cart.all.items[0].uuid;

        expect(cart.getItemByUuid(uuid)).to.have.property('quantity', 4);
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
    it('should remove the correct item', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
      cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
      const uuid = cart.all.items[1].uuid;

      cart.remove(uuid);
      expect(cart.length).to.equal(2);
    });
  });

  describe('get length', () => {
    it('should be 2', () => {
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

  describe('getItemById', () => {
    it('should return correct item by id', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
      cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });

      const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10 };
      expect(cart.getItemById(2)).excludingEvery('uuid').to.deep.equal(expected);
    });
  });

  describe('getItemByUuid', () => {
    it('should return correct item by uuid', () => {
      cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
      cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 10 });
      cart.add({ id: 3, name: 'Item 3', quantity: 1, price: 10 });
      const uuid = cart.all.items[1].uuid;

      const expected = { id: 2, name: 'Item 2', quantity: 1, price: 10, subTotal: 10 };
      expect(cart.getItemByUuid(uuid)).excludingEvery('uuid').to.deep.equal(expected);
    });
  });
});
