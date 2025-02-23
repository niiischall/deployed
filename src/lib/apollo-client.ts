import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: 'https://gql.hashnode.com/',
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
