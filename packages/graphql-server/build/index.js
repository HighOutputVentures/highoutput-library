"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highoutput_http_server_1 = __importDefault(require("highoutput-http-server"));
const apollo_server_koa_1 = require("apollo-server-koa");
class GraphQLServer extends highoutput_http_server_1.default {
    constructor(options) {
        super(options);
        this.options = options;
    }
    async start() {
        await super.start();
        const server = new apollo_server_koa_1.ApolloServer(this.options);
        server.applyMiddleware({ app: this.app });
    }
}
exports.default = GraphQLServer;
//# sourceMappingURL=index.js.map