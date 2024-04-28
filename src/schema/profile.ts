export default `#graphql

type Profile {
  _id: ID!
  userId: ID!
  firstName: String!
  lastName: String!
  city: String!
  province: String!
  country: String!
}

type Query {
  getProfile: Profile!
}

type Mutation {
  updateProfile(firstName: String, lastName: String, city: String, province: String, country: String): Profile!
}
`;
