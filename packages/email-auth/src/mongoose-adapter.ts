import {
  Connection, Model, Document, Schema,
} from 'mongoose';
import cryptoRandomString from 'crypto-random-string';

import {
  Email, ID, InputData, QueryOptions, StorageProvider,
} from './types';

type EmailDocument = Document<ID> & {
  id: ID;
  email: Email;
  otp: string;
  createdAt: Date | undefined;
};

export class MongooseAdapter
implements
    StorageProvider<
      EmailDocument,
      Pick<EmailDocument, 'email'>,
      Pick<EmailDocument, 'email' | 'otp'>
    > {
  private _model: Promise<Model<EmailDocument>>;

  constructor(db: Connection) {
    this._model = (async () => this.getModel(db))();
  }

  async getModel(db: Connection): Promise<Model<EmailDocument>> {
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

    return db.model<EmailDocument>('EmailOTP', schema);
  }

  async create(
    params: InputData<Pick<EmailDocument, 'email'>>,
  ): Promise<EmailDocument> {
    const model = await this._model;

    const document = await model.create(params.data);

    return document;
  }

  async find(params: {
    filter: Pick<EmailDocument, 'email' | 'otp'>;
    options?: QueryOptions;
  }): Promise<EmailDocument[]> {
    const model = await this._model;

    const documents = await model
      .find(
        {
          ...params.filter,
        },
        null,
        params.options ? params.options : {},
      )
      .exec();

    return documents;
  }
}
