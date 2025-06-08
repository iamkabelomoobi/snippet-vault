'use client';

import { ApolloClient, InMemoryCache, ApolloProvider as Provider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}