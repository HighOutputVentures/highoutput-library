import { Connection, Model, Schema } from 'mongoose';
import { StorageAdapter } from '../interfaces';
import { User } from '../lib/types';

export class MongooseStorageAdapter implements StorageAdapter {
  private models = {
    Otp: Model,
    User: Model,
  };

  constructor(
    private connection: Connection,
    opts: {
      userModel: string;
    },
  ) {
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
      },
    });

    schema.index({ otp: 1 });
    schema.index({ user: 1, otp: 1 }, { unique: true });

    this.models.Otp = this.connection.model('Otp', schema);

    this.models.User = this.connection.model(opts.userModel);
  }

  async validateOtp(params: { otp: string }): Promise<User | null> {
    const otp = await this.models.Otp.findOne({ otp: params.otp });

    if (!otp) {
      return null;
    }

    return this.models.User.findOne({ _id: otp.user });
  }

  async saveOtp(params: { user: Buffer; otp: string }) {
    await this.models.Otp.create(params);
  }

  async findOneUserByEmail(params: {
    emailAddress: string;
  }): Promise<User | null> {
    return this.models.User.findOne({ emailAddress: params.emailAddress });
  }
}
