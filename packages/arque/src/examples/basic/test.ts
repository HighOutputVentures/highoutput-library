import crypto from 'crypto';
import R from 'ramda';
import { expect } from 'chai';
import delay from '@highoutput/delay';
import app from '.';

async function main() {
  await app.start();

  const [first, second, third, fourth] = R.times(() => crypto.randomBytes(16), 4);

  await Promise.all([
    (async () => {
      await app.command.credit(first, 50);
      await app.command.debit(first, 20);
      await app.command.credit(first, 5);
    })(),
    (async () => {
      await app.command.credit(second, 1000);
      await app.command.credit(second, 25);
    })(),
    (async () => {
      await app.command.credit(third, 15);
      await app.command.debit(third, 25).catch(() => {});
    })(),
  ]);

  await delay(100);

  expect(await Promise.all(R.map((id) => app.query.balance(id), [first, second, third, fourth]))).to.deep.equal([
    35,
    1025,
    15,
    0,
  ]);
}

main();
