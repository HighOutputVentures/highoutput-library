import mongoose from 'mongoose';

// main
export function main(host: string) {
  return new Promise((resolve) => {
    mongoose
      .connect(host)
      .then((value) => {
        resolve(value);
      });
  });
}

export function close(): Promise<void> {
  return mongoose.disconnect();
}
