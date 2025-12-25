'use client';

import { useRouter } from 'next/navigation';
import PlaceReviewForm from '@/components/PlaceReviewForm';
import { Place, PlaceReviewInput } from '@/lib/types';

export default function PlaceReviewFormWrapper({
  place,
  value,
  userId,
}: {
  place: Place;
  value: PlaceReviewInput;
  userId: string;
}) {
  const router = useRouter();

  async function onSubmit(v: any) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
    if (!res.ok) {
      const text = await res.text();
      alert(`Failed to save: ${text}`);
      return;
    }
    const data = await res.json();
    // After save, navigate back to profile (or could go to place page when available)
    router.push(`/profile/${userId}`);
  }

  return <PlaceReviewForm place={place} value={value} onSubmit={onSubmit} />;
}
