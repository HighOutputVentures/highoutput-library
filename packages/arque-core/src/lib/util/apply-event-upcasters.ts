/* eslint-disable no-constant-condition, no-loop-func */
import { Event } from '@arque/types';

import R from 'ramda';

type EventUpcaster<TEvent extends Event> = {
  filter: { type: TEvent['type']; version: number; aggregate?: { type?: Event['aggregate']['type'] } },
  upcaster: (event: Event) => TEvent;
};

const checkUpcaster = <TEvent extends Event>(
  filter: { type: string; version: number; aggregate?: { type?: string; } },
  event: Pick<TEvent, 'type' | 'version' | 'aggregate'>,
) => {
  const partial = filter.type === event.type && filter.version === event.version;

  const aggregateType = R.path(['aggregate', 'type'])(filter);

  if (aggregateType) {
    return partial && aggregateType === event.aggregate.type;
  }

  return partial;
};

export default <TEvent extends Event>(event: TEvent, eventUpcasters: EventUpcaster<TEvent>[]): TEvent => {
  if (!eventUpcasters.length) return event;

  let upcastedEvent = event;

  while (true) {
    const eventUpcaster = eventUpcasters.find(({ filter }) => checkUpcaster({
      ...(filter.aggregate ? { aggregate: { type: filter.aggregate.type } } : {}),
      type: filter.type,
      version: filter.version,
    }, upcastedEvent));

    if (!eventUpcaster) {
      break;
    }

    upcastedEvent = {
      ...eventUpcaster.upcaster(upcastedEvent),
      version: eventUpcaster.filter.version + 1,
    };
  }

  return upcastedEvent;
};
