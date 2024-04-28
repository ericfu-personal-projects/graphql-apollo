
export default `#graphql
  type User {
    _id: ID!
    email: String
    password: String
    salt: String
  }

  type LoginPayload {
    token: String
  }

  type Query {
    login(
      email: String!
      password: String!
    ): LoginPayload
  }

  type Mutation {
    register(
      email: String!
      password: String!
    ): LoginPayload
  }
`;