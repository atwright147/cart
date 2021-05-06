#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

// node < v15 does not support `crypto.getRandomValues()`, so you must install this polyfill
global.crypto = { getRandomValues: require('polyfill-crypto.getrandomvalues') };
const { Cart } = require('../../dist');

const myCart = new Cart();

myCart.add({ id: 123, name: 'Item 1', quantity: 3, price: 9.99 });
myCart.add({ id: 456, name: 'Item 2', quantity: 2, price: 10.99 });
myCart.add({ id: 789, name: 'Item 3', quantity: 1, price: 11.99 });

console.table(myCart.all.items);
console.table({ total: myCart.total, length: myCart.length });
