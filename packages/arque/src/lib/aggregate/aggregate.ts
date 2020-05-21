import EventStoreClient from '../event-store/client';

export default function(params: {
  type: string;
  eventStore: EventStoreClient;
}) {
  return function (constructor: Function) {
    Object.defineProperty(constructor.prototype, 'type', {
      get: function type() {
        return params.type;
      }
    });
  }
}
