import { Kind, GraphQLScalarType, ValueNode } from 'graphql';
import { ObjectId } from '@highoutput/object-id';

export const ObjectIdResolver = new GraphQLScalarType<ObjectId, string>({
  name: 'ObjectId',
  description: 'ObjectId custom scalar type',

  serialize(value: ObjectId) {
    return value.toString();
  }

  parseValue(value: string): ObjectId {
    return ObjectId.from(value);
  }

  parseLiteral(ast: ValueNode): ObjectId {
    if (ast.kind === Kind.STRING) {
      return ObjectId.from(ast.value);
    }

    throw new Error(`'${ast.kind}' type is not supported`);
  }
})