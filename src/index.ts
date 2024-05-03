import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

// Local imports
import { verifyToken } from './utils/jwtUtil.js';
import CustomErrors from './errors/custom.js';
import resolvers from './resolvers/index.js';
import typeDefs from './schema/index.js';

const app = express();

const httpServer = http.createServer(app);

mongoose.connect('mongodb://localhost:27017/test', { autoIndex: false });

const server = new ApolloServer({
  includeStacktraceInErrorResponses: false,
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];

      if (!token) {
        return null;
      }

      try {
        const user = verifyToken(token);
        return { user };
      } catch (error) {
        return CustomErrors.UNAUTHORIZED;
      }
    },
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
