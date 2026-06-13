import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';
import { SanityImage } from './types';

const builder = createImageUrlBuilder(sanityClient);

export const resolveSanityImageUrl = (
  image: SanityImage | undefined,
  fallbackUrl?: string
) => {
  if (image?.asset?._ref) {
    return builder.image(image).width(1300).height(630).fit('crop').url();
  }

  return fallbackUrl || '';
};
