# Shopping Cart

A simple shopping cart for Node or Browser, written in TypeScript

[![codecov](https://codecov.io/gh/atwright147/shopping-cart-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/atwright147/shopping-cart-ts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=atwright147_shopping-cart-ts&metric=alert_status)](https://sonarcloud.io/dashboard?id=atwright147_shopping-cart-ts)

## Install

```js
npm i -S @atwright147/cart
```

## Usage

```js
// node < v15 does not support `crypto.getRandomValues()`, so you must install this polyfill (modern browsers should be fine though)
global.crypto = { getRandomValues: require('polyfill-crypto.getrandomvalues') };
import { Cart } from '@atwright147/cart';

const cart = new Cart();

// add an item to the cart
// `id` could be anything but I suggest using the `id` from your database
cart.add({ id: 1, name: 'Item 1', quantity: 1, price: 10 });
cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 5 });

// check item is in the cart (returns a `boolean`)
cart.has({ id: 1 })
cart.has({ uuid: '<uuid>' })

// check how many unique items are in the cart
cart.length  // 2

// adding an item to the cart which is already added increments the quantity of item in the cart with ID 2 by `quantity`
cart.add({ id: 2, name: 'Item 2', quantity: 1, price: 5 });

// check the total value of the cart
cart.total  // 20

// list all items in the cart
// also tells you the total value of the whole cart and the `subTotal` for each row
cart.all  /* {
    items: [
      { id: 1, uuid: "<uuid1>", name: "Item 1", quantity: 1, price: 10, subTotal: 10 },
      { id: 2, uuid: "<uuid2>", name: "Item 2", quantity: 2, price: 5, subTotal: 10 }
    ],
    total: 20
  } */

// get items by `id` or `uuid`
cart.get({ id: 1 })  // { id: 1, uuid: "<uuid1>", name: "Item 1", quantity: 2, price: 5, subTotal: 10 }
cart.get({ uuid: '<uuid2>' })  // { id: 2, uuid: "<uuid2>", name: "Item 2", quantity: 2, price: 5, subTotal: 10 }

// remove an item by `id` or `uuid`
cart.remove({ id: 1 });  // remove row where id equals 1
cart.remove({ uuid: '<uuid2>' });  // remove row where uuid equals <uuid2>
```

Please refer to the included demos for working examples of CommonJS and UMD usage.
