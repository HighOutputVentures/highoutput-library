import {
  Kind,
  GraphQLScalarType,
  ValueNode,
  GraphQLScalarTypeConfig,
} from 'graphql';

export const GraphQLCursorConfig: GraphQLScalarTypeConfig<Buffer, string> = {
  name: 'Cursor',
  description: 'Cursor custom scalar type',

  serialize(value) {
    return (value as Buffer).toString('base64');
  },

  parseValue(value) {
    return Buffer.from(value as string, 'base64');
  },

  parseLiteral(ast: ValueNode): Buffer {
    if (ast.kind === Kind.STRING) {
      return Buffer.from(ast.value, 'base64');
    }

    throw new Error(`'${ast.kind}' type is not supported`);
  }
}

export const ObjectIdResolver = new GraphQLScalarType(GraphQLCursorConfig);
