import { LoginClient } from './login-client';

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  const raw = resolved?.callbackUrl;
  const callbackUrl = Array.isArray(raw) ? raw[0] : raw;
  return <LoginClient callbackUrl={callbackUrl} />;
}
