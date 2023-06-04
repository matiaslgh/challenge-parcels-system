export function buildApiUrl(restOfUrl: string) {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${restOfUrl}`;
}
