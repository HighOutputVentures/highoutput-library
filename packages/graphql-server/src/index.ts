import HTTPServer, { HTTPServerOptions } from 'highoutput-http-server';
import { ApolloServer } from 'apollo-server-koa';
import { Context } from 'koa';

export interface GraphQLServerOptions {
  typeDefs: any;
  resolvers: any;
}

export default class GraphQLServer extends HTTPServer {
  constructor(protected options: HTTPServerOptions & GraphQLServerOptions) {
    super(options);
  }

  async start() {
    await super.start();

    const server = new ApolloServer({
      ...this.options,
      context: ({ ctx }: { ctx: Context }) => ctx,
    });
    server.applyMiddleware({ app: this.app });
  }
}
