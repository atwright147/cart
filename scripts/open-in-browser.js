/* eslint-disable */

/* c8 ignore start */
let start = '';
const url = './demos/frontend/index.html';

switch (process.platform) {
  case 'win32':
    start = 'start';
    break;

  case 'darwin':
    start = 'open';
    break;

  default:
    start = 'xdg-open';
    break;
}

console.info(`${start} ${url}`);

require('child_process').exec(`${start} ${url}`);
/* c8 ignore end */
