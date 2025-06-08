import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    role: Role!
    createdAt: String!
    snippets: [Snippet!]!
  }

  type Snippet {
    id: String!
    title: String!
    description: String!
    language: String!
    code: String!
    fileName: String
    filePath: String
    status: SnippetStatus!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  enum Role {
    USER
    ADMIN
  }

  enum SnippetStatus {
    PENDING
    APPROVED
    REJECTED
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateSnippetInput {
    title: String!
    description: String!
    language: String!
    code: String!
    fileName: String
  }

  input UpdateSnippetInput {
    title: String
    description: String
    language: String
    code: String
    fileName: String
  }

  type Query {
    # Public queries
    snippets: [Snippet!]!
    snippet(id: String!): Snippet
    
    # Protected queries
    me: User
    mySnippets: [Snippet!]!
    
    # Admin queries
    allSnippets: [Snippet!]!
    pendingSnippets: [Snippet!]!
  }

  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Boolean!
    resetPassword(token: String!, password: String!): Boolean!
    
    # Snippet mutations
    createSnippet(input: CreateSnippetInput!): Snippet!
    updateSnippet(id: String!, input: UpdateSnippetInput!): Snippet!
    deleteSnippet(id: String!): Boolean!
    
    # Admin mutations
    approveSnippet(id: String!): Snippet!
    rejectSnippet(id: String!, reason: String): Snippet!
  }
`;