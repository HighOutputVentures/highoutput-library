import {
  Connection, Model, Document, Schema,
} from 'mongoose';
import cryptoRandomString from 'crypto-random-string';

import { ID } from '../types';
import { PersistenceAdapter } from '../interfaces/persistence-adapter';

type EmailDocument = Document<ID> & {
  id: ID;
  email: string;
  otp: string;
  createdAt: Date | undefined;
};

export class MongooseAdapter implements PersistenceAdapter<
  EmailDocument,
  Pick<EmailDocument, 'email'>,
  Pick<EmailDocument, 'email' | 'otp'>
> {
  private model: Model<EmailDocument>;

  constructor(db: Connection) {
    const schema = new Schema<EmailDocument>({
      email: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
        default: () => cryptoRandomString({ length: 6, type: 'numeric' }),
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    });

    this.model = db.model<EmailDocument>('EmailOTP', schema);
  }

  async create(
    params: { data: Pick<EmailDocument, 'email'> },
  ): Promise<EmailDocument> {
    const document = await this.model.create(params.data);

    return document;
  }

  async findOne(params: any): Promise<EmailDocument | null> {
    const document = await this.model
      .findOne(params)
      .sort({ createdAt: -1 })
      .exec();

    return document;
  }
}
