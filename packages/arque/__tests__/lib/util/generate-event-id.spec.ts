import R from 'ramda';
import { expect } from 'chai';
import generateEventId from '../../../src/lib/util/generate-event-id';

describe('generateEventId', () => {
  it('should generate unique event ids', () => {
    expect(R.uniq(R.times(() => generateEventId(), 1000))).to.has.length(1000);
  });
});
