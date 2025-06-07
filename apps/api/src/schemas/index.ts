import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String!
    users: [User!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`;
