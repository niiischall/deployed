import { GET_ALL_POSTS, GET_POST_BY_SLUG } from './queries';
import createApolloClient from './apollo-client';

export const fetchAllPosts = async (client: any, hostname?: string) => {
  let allPosts: any[] = [];

  const { data } = await client.query({
    query: GET_ALL_POSTS,
    variables: { hostname },
  });

  const posts = data.publication.posts.edges.map((edge: any) => edge.node);
  allPosts = [...allPosts, ...posts];

  return allPosts;
};

export const getAllPosts = async () => {
  const client = createApolloClient();
  const allPosts = await fetchAllPosts(client, process.env.HASHNODE_HOSTNAME);
  return allPosts;
};

export const fetchPostBySlug = async ({
  client,
  slug,
  hostname,
}: {
  client: any;
  slug: string;
  hostname?: string;
}) => {
  const response = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { hostname, slug },
  });
  const { data } = response;
  const { publication } = data ?? {};
  const { post } = publication ?? {};
  return post;
};
