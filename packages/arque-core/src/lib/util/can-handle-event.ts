import R from 'ramda';
import { EventFilter, Event } from '@arque/types';

export default function (filter: EventFilter, event: Event) {
  const partial = R.omit(['aggregate'], filter);

  if (!R.equals(partial, R.pick(R.keys(partial), event))) {
    return false;
  }

  if (filter.aggregate && !R.equals(filter.aggregate, R.pick(R.keys(filter.aggregate), event.aggregate))) {
    return false;
  }

  return true;
}
