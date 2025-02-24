export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length; // Count words
  const minutes = Math.ceil(wordCount / wordsPerMinute); // Round up to full minutes
  return `${minutes} min read`;
};
