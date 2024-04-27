import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];
const resolvers = {
    Query: {
        books: () => books,
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';
        console.log({ token });
        return token;
        // try to retrieve a user with the token
        // const user = getUser(token);
        // optionally block the user
        // we could also check user roles/permissions here
        // if (!user){
        //   // throwing a `GraphQLError` here allows us to specify an HTTP status code,
        //   // standard `Error`s will have a 500 status code by default
        //   throw new GraphQLError('User is not authenticated', {
        //     extensions: {
        //       code: 'UNAUTHENTICATED',
        //       http: { status: 401 },
        //     },
        //   });
        //   }
        // // add the user to the context
        // return { user };
    },
});
console.log(`🚀  Server ready at: ${url}`);