'use client';

import { useEffect, useState } from 'react';
import PlaceReviewForm from '@/components/PlaceReviewForm';
import { Place, PlaceReview } from '@/lib/types';
import { getCurrentUser } from '@/lib/data';

export default function PlaceReviewFormWrapper({
  place,
  value,
  userId,
}: {
  place: Place;
  value: PlaceReview;
  userId: string;
}) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setIsOwner(user.id === userId);
    });
  }, [userId]);

  return <PlaceReviewForm place={place} value={value} readOnly={!isOwner} />;
}
