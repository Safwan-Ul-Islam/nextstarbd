const TOTAL = 5;

export function resolveBannerUrl(bannerUrl: string | null | undefined, id: string): string {
  if (bannerUrl) return bannerUrl;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return `/banners/ff${(hash % TOTAL) + 1}.png`;
}
