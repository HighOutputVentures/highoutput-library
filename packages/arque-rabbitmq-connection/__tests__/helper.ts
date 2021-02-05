/* eslint-disable import/prefer-default-export */
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Chance from 'chance';

chai.use(chaiAsPromised);

export const chance = new Chance();

export { expect };
