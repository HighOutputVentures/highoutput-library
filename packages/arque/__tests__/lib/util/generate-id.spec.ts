import R from 'ramda';
import { expect } from 'chai';
import generateId from '../../../src/lib/util/generate-id';

describe('generateId', () => {
  it('should generate unique event id', () => {
    expect(R.uniq(R.times(() => generateId(), 1000))).to.has.length(1000);
  });
});
