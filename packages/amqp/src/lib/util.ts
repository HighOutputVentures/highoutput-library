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
