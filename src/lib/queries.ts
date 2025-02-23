import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts($hostname: String!) {
    publication(host: $hostname) {
      title
      id
      posts(first: 50) {
        # Adjust this number to fetch more posts
        edges {
          node {
            id
            title
            subtitle
            slug
            publishedAt
            coverImage {
              url
              attribution
            }
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($hostname: String!, $slug: String!) {
    publication(host: $hostname) {
      post(slug: $slug) {
        id
        title
        content {
          markdown
        }
        coverImage {
          url
        }
        publishedAt
      }
    }
  }
`;
