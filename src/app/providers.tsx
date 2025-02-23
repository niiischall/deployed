'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

import PostHogPageView from './pageview';

export function PostHogProvider({ children }: { children: any }) {
  useEffect(() => {
    const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (postHogKey) {
      posthog.init(postHogKey, {
        api_host: postHogHost,
        person_profiles: 'always',
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
