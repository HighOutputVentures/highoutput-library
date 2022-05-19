import {
  Connection, Model, Document, Schema, Collection,
} from 'mongoose';
import cryptoRandomString from 'crypto-random-string';

import { ID } from '../types';
import { PersistenceAdapter } from '../interfaces/persistence-adapter';

type EmailDocument = Document<ID> & {
  id: ID;
  user: Buffer;
  otp: string;
  createdAt: Date;
};

type UserDocument = {
  id: ID;
  email: string;
}


export class MongooseAdapter implements PersistenceAdapter<
  EmailDocument,
  Pick<EmailDocument, 'user'>,
  Pick<EmailDocument, 'user' | 'otp'>
> {
  private readonly emailOTPModel: Model<EmailDocument>;

  private readonly userCollection: Collection<UserDocument>;

  constructor(options: {
    db: Connection,
    userCollectionString: string;
  }) {
    const emailOtpSchema = new Schema<EmailDocument>({
      user: {
        type: Buffer,
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
        default: new Date(),
      },
    });

    this.emailOTPModel = options.db.model<EmailDocument>('EmailOTP', emailOtpSchema, 'emailauth:emailotp');

    this.userCollection = options.db.collection(options.userCollectionString);
  }

  async createEmailOtp(
    params: { data: Pick<EmailDocument, 'user'> },
  ): Promise<EmailDocument> {
    const document = await this.emailOTPModel.create(params.data);

    return document;
  }

  async findOneEmailOtp(params: any): Promise<EmailDocument | null> {
    const document = await this.emailOTPModel
      .findOne(params)
      .sort({ createdAt: -1 })
      .exec();

    return document;
  }

  async findOneUserByEmail(params: { email: string }): Promise<UserDocument | null> {
    const user = await this.userCollection.findOne({ email: params.email });

    return user;
  }
}
