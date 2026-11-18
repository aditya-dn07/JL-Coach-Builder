'use client';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RetryPanel } from '@/components/errors/retry-panel';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <RetryPanel
      retry={() =>
        startTransition(() => {
          router.refresh();
          reset();
        })
      }
    />
  );
}
