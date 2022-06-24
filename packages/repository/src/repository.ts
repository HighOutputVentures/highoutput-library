import { Model, Document, FilterQuery, Connection, Schema } from 'mongoose';
import R from 'ramda';
import { ObjectId } from '@highoutput/object-id';
import { BaseEntity } from './types';

type SerializedObjectId = {
  _type: 'ObjectId';
  data: Buffer;
};

type Binary = {
  _bsontype: 'Binary';
  buffer: Buffer;
};

function deserialize(doc: Document | null) {
  if (!doc) return null;

  let raw: unknown = doc;

  if (doc.toObject) {
    raw = doc.toObject({ virtuals: true });
  }

  const obj = {
    ...R.omit(['_id', '__v'], raw),
    id: ObjectId.from(doc._id),
  } as Record<string, unknown>;

  return R.reduce(
    (accum, [field, value]) => {
      if (value && typeof value === 'object') {
        if ((value as Binary)._bsontype === 'Binary') {
          return {
            ...accum,
            [field]: (value as Binary).buffer,
          };
        }

        if ((value as SerializedObjectId)._type === 'ObjectId') {
          return {
            ...accum,
            [field]: ObjectId.from((value as SerializedObjectId).data),
          };
        }
      }

      return {
        ...accum,
        [field]: value,
      };
    },
    {},
    R.toPairs(obj) as [string, unknown][],
  ) as BaseEntity & Record<string, unknown>;
}

function serialize(doc: Record<string, unknown>) {
  let obj: Record<string, unknown> = doc;
  if (doc.id) {
    obj = {
      ...obj,
      _id: (doc.id as ObjectId).toBuffer(),
    };
  }

  return R.reduce(
    (accum, [field, value]) => {
      if (field === 'id') {
        return {
          ...accum,
          _id: (value as ObjectId).toBuffer(),
        };
      }

      if (value instanceof ObjectId) {
        return {
          ...accum,
          [field]: {
            _type: 'ObjectId',
            data: (value as ObjectId).toBuffer(),
          },
        };
      }

      return {
        ...accum,
        [field]: value,
      };
    },
    {},
    R.toPairs(obj) as [string, unknown][],
  ) as Record<string, unknown>;
}

function serializeFilter(filter: FilterQuery<Record<any, any>>) {
  return R.reduce(
    (accum, [field, value]) => {
      if (field === 'id') {
        return {
          ...accum,
          _id: (value as ObjectId).toBuffer(),
        };
      }

      if (value instanceof ObjectId) {
        return {
          ...accum,
          [`${field}.data`]: (value as ObjectId).toBuffer(),
        };
      }

      return {
        ...accum,
        [field]: value,
      };
    },
    {},
    R.toPairs(filter) as [string, unknown][],
  ) as Record<string, unknown>;
}

export class Repository<
  TEntity extends BaseEntity = BaseEntity,
  TCreate extends BaseEntity = BaseEntity & Partial<Omit<TEntity, 'id'>>,
> {
  private model: Model<Document & TEntity>;
  constructor(mongoose: Connection, collectionName: string, schema: Schema) {
    this.model = mongoose.model(collectionName, schema);
  }

  async exists(filter: FilterQuery<TEntity>): Promise<boolean> {
    const entity = await this.model.exists(serializeFilter(filter));

    return !!entity;
  }

  async create(args: TCreate): Promise<TEntity> {
    return deserialize(await this.model.create(serialize(args))) as TEntity;
  }

  async findById(id: ObjectId): Promise<TEntity> {
    const doc = await this.model.findById(id.toBuffer());
    return deserialize(doc) as TEntity;
  }

  async updateOne(
    filter: FilterQuery<TEntity>,
    data: Partial<Omit<TEntity, 'id'>>,
    options?: Partial<{ upsert: boolean; new: boolean }>,
  ): Promise<TEntity> {
    const document = await this.model.findOneAndUpdate(
      serializeFilter(filter),
      R.filter((value) => value !== undefined)(data) as never,
      {
        upsert: false,
        new: true,
        ...options,
      },
    );

    return deserialize(document) as TEntity;
  }

  async find(filter: FilterQuery<TEntity>): Promise<TEntity[]> {
    return R.map(
      (entity) => deserialize(entity),
      await this.model.find(serializeFilter(filter)),
    ) as TEntity[];
  }

  async findOne(filter: FilterQuery<TEntity>): Promise<TEntity> {
    return deserialize(
      await this.model.findOne(serializeFilter(filter)),
    ) as TEntity;
  }

  async deleteById(id: ObjectId) {
    await this.model.deleteOne({ _id: id.toBuffer() });
  }

  async deleteMany(filter: FilterQuery<TEntity>) {
    await this.model.deleteMany(filter);
  }
}
