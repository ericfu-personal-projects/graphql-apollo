import { ApolloServer } from '@apollo/server';
import mongoose from 'mongoose';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { GraphQLError } from 'graphql';
import typeDefs from './schema/index.js';
import resolvers from './resolvers/index.js';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || 'mysecret';
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);
mongoose.connect('mongodb://localhost:27017/test', { autoIndex: false });
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    includeStacktraceInErrorResponses: false,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
await server.start();
// Specify the path where we'd like to mount our server
app.use('/', cors(), express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token) {
            return null;
        }
        try {
            const user = jwt.verify(token, jwtSecret);
            return { user };
        }
        catch (error) {
            throw new GraphQLError('Invalid token', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 }
                }
            });
        }
    }
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
