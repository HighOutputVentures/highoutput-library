import { Connection, Model, Schema } from 'mongoose';
import { StorageAdapter } from '../interfaces';
import { User } from '../lib/types';

export class MongooseStorageAdapter implements StorageAdapter {
  private models = {
    Otp: Model,
    User: Model,
  };

  constructor(private connection: Connection, _opts: {}) {
    const schema = new Schema({
      user: {
        type: Buffer,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      dateTimeCreated: {
        type: Date,
        default: () => new Date(),
      }
    });

    schema.index({ otp: 1 });
    schema.index({ user:1, otp: 1 }, { unique: true });

    this.models.Otp = this.connection.model('Otp', schema);
  }

  validateOtp(_params: { otp: string; }): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async saveOtp(params: { user: Buffer; otp: string; }) {
    await this.models.Otp.create(params);
  }

  findOneUserByEmail(_params: { emailAddress: string; }): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}