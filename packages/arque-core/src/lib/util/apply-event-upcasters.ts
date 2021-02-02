/* eslint-disable no-constant-condition, no-loop-func */
import { Event, EventUpcaster } from '@arque/types';

const checkUpcaster = <TEvent extends Event>(
  filter: EventUpcaster<TEvent>['filter'],
  event: Pick<TEvent, 'type' | 'version'>,
) => filter.type === event.type
  && filter.version === event.version;

export default <TEvent extends Event>(event: TEvent, eventUpcasters: EventUpcaster<TEvent>[]): TEvent => {
  if (!eventUpcasters.length) return event;

  let upcastedEvent = event;

  while (true) {
    const eventUpcaster = eventUpcasters.find(({ filter }) => checkUpcaster({
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
