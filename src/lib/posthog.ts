type PostHogQueryResponse = {
  results?: Array<Record<string, unknown> | unknown[]>;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const toPostHogApiHost = (host: string): string =>
  trimTrailingSlash(host)
    .replace('://us.i.posthog.com', '://us.posthog.com')
    .replace('://eu.i.posthog.com', '://eu.posthog.com');

const parseViews = (payload: PostHogQueryResponse): number => {
  const firstRow = payload.results?.[0];

  if (!firstRow) {
    return 0;
  }

  if (Array.isArray(firstRow)) {
    const value = Number(firstRow[0]);
    return Number.isFinite(value) ? value : 0;
  }

  const rowViews = Number(firstRow.views ?? firstRow.count ?? firstRow.total ?? 0);
  return Number.isFinite(rowViews) ? rowViews : 0;
};

export const getLifetimePostViews = async (postUrl: string): Promise<number | null> => {
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const hostFromEnv = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectId || !personalApiKey || !hostFromEnv) {
    return null;
  }

  const apiHost = toPostHogApiHost(hostFromEnv);
  const endpoint = `${apiHost}/api/projects/${projectId}/query`;
  const escapedPostUrl = postUrl.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${personalApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query: `SELECT count() AS views FROM events WHERE event = '$pageview' AND (properties.$current_url = '${escapedPostUrl}' OR startsWith(properties.$current_url, concat('${escapedPostUrl}', '?')))`,
        },
      }),
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      console.error(`PostHog query failed with status ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as PostHogQueryResponse;
    return parseViews(payload);
  } catch (error) {
    console.error('Failed to fetch lifetime post views from PostHog:', error);
    return null;
  }
};
