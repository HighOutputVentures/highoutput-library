import Chance from 'chance';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

export const chance = new Chance();

export { expect };
