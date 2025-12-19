import { ResetPasswordClient } from './reset-password-client';

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  const raw = resolved?.token;
  const token = Array.isArray(raw) ? raw[0] : raw;
  return <ResetPasswordClient token={token} />;
}
