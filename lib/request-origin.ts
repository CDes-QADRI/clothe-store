import type { NextRequest } from 'next/server';

function firstHeaderValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const first = value.split(',')[0]?.trim();
  return first || undefined;
}

export function getRequestOrigin(req: NextRequest): string {
  const forwardedProto = firstHeaderValue(req.headers.get('x-forwarded-proto'));
  const forwardedHost = firstHeaderValue(req.headers.get('x-forwarded-host'));
  const host = forwardedHost ?? firstHeaderValue(req.headers.get('host'));

  if (!host) {
    return req.nextUrl.origin;
  }

  const proto = forwardedProto ?? (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}
