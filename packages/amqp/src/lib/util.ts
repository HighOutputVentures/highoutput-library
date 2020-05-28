/* eslint-disable no-underscore-dangle */
import R from 'ramda';
import {
  Receiver, Sender, Connection, ReceiverOptions, SenderOptions,
} from 'rhea';

export async function openReceiver(connection: Connection, options: ReceiverOptions | string) {
  const receiver = connection.open_receiver(options);
  await new Promise((resolve, reject) => {
    receiver.once('receiver_open', resolve);
    receiver.once('receiver_error', reject);
  });

  return receiver;
}

export async function closeReceiver(receiver: Receiver) {
  const promise = new Promise((resolve) => {
    receiver.once('receiver_close', resolve);
  });

  receiver.close();

  await promise;
}

export async function openSender(connection: Connection, options: SenderOptions) {
  const sender = connection.open_sender(options);

  await new Promise((resolve, reject) => {
    sender.once('sender_open', resolve);
    sender.once('sender_error', reject);
  });

  return sender;
}

export async function closeSender(sender: Sender) {
  const promise = new Promise((resolve) => {
    sender.once('sender_close', resolve);
  });

  sender.close();

  await promise;
}

export function serialize(object: any): any {
  const type = typeof object;

  if (type === 'object') {
    if (object instanceof Date) {
      return {
        __classObject: true,
        type: 'Date',
        data: object.toISOString(),
      };
    }

    if (object instanceof Set) {
      return {
        __classObject: true,
        type: 'Set',
        data: Array.from(object),
      };
    }

    if (object instanceof Map) {
      return {
        __classObject: true,
        type: 'Map',
        data: Array.from(object),
      };
    }

    if (object instanceof Buffer) {
      return {
        __classObject: true,
        type: 'Buffer',
        data: object.toString('base64'),
      };
    }

    if (object === null) {
      return null;
    }

    return R.map(serialize)(object);
  }

  return object;
}

export function deserialize(object: any): any {
  const type = typeof object;

  if (type === 'object'
    && !(object instanceof Date || object instanceof Set || object instanceof Map || object instanceof Buffer)) {
    if (object === null) {
      return null;
    }

    if (object.__classObject) {
      if (object.type === 'Date') {
        return new Date(object.data);
      }

      if (object.type === 'Set') {
        return new Set(object.data);
      }

      if (object.type === 'Map') {
        return new Map(object.data);
      }

      if (object.type === 'Buffer') {
        return Buffer.from(object.data, 'base64');
      }
    }

    return R.map(deserialize)(object);
  }

  return object;
}

export default deserialize;
