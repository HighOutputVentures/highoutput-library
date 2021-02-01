import { Event, EventUpcaster } from '@arque/types';

const checkUpcaster = <TEvent extends Event>(
  filter: EventUpcaster<TEvent>['filter'],
  event: Pick<TEvent, 'type' | 'aggregate'>,
) => filter.type === event.type
  && filter.aggregate.version === event.aggregate.version;

export default <TEvent extends Event>(event: TEvent, eventUpcasters: EventUpcaster<TEvent>[]): TEvent => {
  if (!eventUpcasters.length) return event;

  let upcastedEvent = event;

  while (true) {
    const eventUpcaster = eventUpcasters.find(({ filter }) => checkUpcaster({
      type: filter.type,
      aggregate: { version: filter.aggregate.version },
    }, upcastedEvent));

    if (!eventUpcaster) {
      break;
    }

    upcastedEvent = {
      ...eventUpcaster.upcaster(upcastedEvent),
      aggregateClassVersion: eventUpcaster.filter.aggregate.version + 1,
    };
  }

  return upcastedEvent;
};