import {
  Kind,
  GraphQLScalarType,
  ValueNode,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { ObjectId } from '@highoutput/object-id';

export const GraphQLObjectIdConfig: GraphQLScalarTypeConfig<ObjectId, string> = {
  name: 'ObjectId',
  description: 'ObjectId custom scalar type',

  serialize(value) {
    return (value as ObjectId).toString();
  },

  parseValue(value) {
    return ObjectId.from(value as string);
  },

  parseLiteral(ast: ValueNode): ObjectId {
    if (ast.kind === Kind.STRING) {
      return ObjectId.from(ast.value);
    }

    throw new Error(`'${ast.kind}' type is not supported`);
  }
}

export const ObjectIdResolver = new GraphQLScalarType(GraphQLObjectIdConfig);
