'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PlaceReview, User } from '@/lib/types';
import { getUser } from '@/lib/data';

interface PlaceReviewCardProps {
  review: PlaceReview;
}

export default function PlaceReviewCard({ review }: PlaceReviewCardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser(review.userId).then(setUser);
  }, [review.userId]);

  if (!user) return null;

  // Get the date from the first item (or use a default date)
  const reviewDate = review.items[0]?.createdAt || new Date().toISOString().split('T')[0];

  return (
    <Link href={`/user/${user.id}/reviews/${review.placeId}`} className="block">
      <div className="bg-base-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-start gap-3">
          {/* User Profile Picture */}
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </div>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            {/* User Name and Date */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base-content truncate">{user.name}</h3>
              <span className="text-xs text-base-content/60 whitespace-nowrap ml-2">
                {reviewDate}
              </span>
            </div>

            {/* Rating and Rank */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{review.rating}/5</span>
              </div>
              <div className="text-sm text-base-content/70">
                Rank #{review.rank}
              </div>
            </div>

            {/* Description Blurb */}
            <div className="text-sm text-base-content/80 leading-relaxed">
              {review.description || (
                <span className="text-base-content/60 italic">
                  Amazing experience! The atmosphere was perfect and the food exceeded expectations. Would definitely recommend to anyone looking for a great dining experience.
                </span>
              )}
            </div>

            {/* Items Count */}
            <div className="mt-3 text-xs text-base-content/60">
              {review.items.length === 1 ? '1 item reviewed' : `${review.items.length} items reviewed`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
