import { gql } from 'graphql-tag';

/**
 * GraphQL schema definition for Snippet Vault API.
 * - Defines User, Snippet, enums, queries, and mutations.
 * - Supports authentication, snippet CRUD, moderation, and file metadata.
 */
export const typeDefs = gql`
  """
  User account in the system.
  """
  type User {
    id: String!
    email: String!
    role: Role!
    createdAt: String!
    snippets: [Snippet!]!
  }

  """
  Code snippet entity.
  """
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

  """
  User roles.
  """
  enum Role {
    USER
    ADMIN
  }

  """
  Moderation status for a snippet.
  """
  enum SnippetStatus {
    PENDING
    APPROVED
    REJECTED
  }

  """
  Auth payload returned after login/register.
  """
  type AuthPayload {
    token: String!
    user: User!
  }

  """
  Input for creating a new snippet.
  """
  input CreateSnippetInput {
    title: String!
    description: String!
    language: String!
    code: String!
    fileName: String
  }

  """
  Input for updating an existing snippet.
  """
  input UpdateSnippetInput {
    title: String
    description: String
    language: String
    code: String
    fileName: String
  }

  type Query {
    # Public: List all approved snippets
    snippets: [Snippet!]!

    # Public: Get a snippet by ID (approved, or if author/admin)
    snippet(id: String!): Snippet

    # Authenticated: Get current user
    me: User

    # Authenticated: Get all snippets by current user
    mySnippets: [Snippet!]!

    # Admin: Get all snippets (any status)
    allSnippets: [Snippet!]!

    # Admin: Get all pending snippets
    pendingSnippets: [Snippet!]!
  }

  type Mutation {
    # Auth
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Boolean!
    resetPassword(token: String!, password: String!): Boolean!

    # Snippet CRUD
    createSnippet(input: CreateSnippetInput!): Snippet!
    updateSnippet(id: String!, input: UpdateSnippetInput!): Snippet!
    deleteSnippet(id: String!): Boolean!

    # Admin moderation
    approveSnippet(id: String!): Snippet!
    rejectSnippet(id: String!, reason: String): Snippet!
  }
`;