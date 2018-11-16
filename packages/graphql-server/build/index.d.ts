import HTTPServer, { HTTPServerOptions } from 'highoutput-http-server';
export interface GraphQLServerOptions {
    typeDefs: any;
    resolvers: any;
}
export default class GraphQLServer extends HTTPServer {
    protected options: HTTPServerOptions & GraphQLServerOptions;
    constructor(options: HTTPServerOptions & GraphQLServerOptions);
}
//# sourceMappingURL=index.d.ts.map