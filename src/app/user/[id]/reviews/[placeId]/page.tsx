import Link from 'next/link';
import { getPlace, getReview, getUser } from '@/lib/data';
import { ItemCategory, ItemReview, PlaceReview } from '@/lib/types';
import PlaceReviewFormWrapper from '@/components/PlaceReviewFormWrapper';
import { FIELD_REPLACE_VALUE } from '@/lib/constants';

function emptyItem(): ItemReview {
  return {
    id: FIELD_REPLACE_VALUE,
    name: '',
    category: 'Entree' as ItemCategory,
    price: '',
    rating: 0,
    rank: 1,
    notes: '',
    photoUrl: '',
    createdAt: FIELD_REPLACE_VALUE,
  };
}

function createInitialValue(placeId: string, userId: string): PlaceReview {
  return {
    id: FIELD_REPLACE_VALUE,
    userId: userId,
    placeId: placeId,
    rating: 0,
    rank: 1,
    items: [emptyItem()],
  };
}

export default async function PlaceReviewPage({ params }: { params: Promise<{ id: string; placeId: string }> }) {
  const { id: userId, placeId } = await params;
  const user = await getUser(userId);
  const place = await getPlace(placeId);

  if (!user || !place) {
    return (
      <div className="prose">
        <h1>Not found</h1>
        <p>User or place could not be found.</p>
        <Link href={`/user/${userId}`} className="btn btn-primary">
          Back to profile
        </Link>
      </div>
    );
  }

  const review = await getReview(placeId, userId);
  const initialValue = createInitialValue(placeId, userId);

  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href={`/user/${user.id}`}>{user.username}</Link>
          </li>
          <li>
            <span className="opacity-70">{place.name}</span>
          </li>
        </ul>
      </div>

      <h1 className="text-3xl font-bold">Review {place.name}</h1>
      <p className="text-base-content/70">
        Add one or more items you tried at this place. Use the + button to add more.
      </p>

      <PlaceReviewFormWrapper value={review ?? initialValue} userId={user.id} place={place} />
    </div>
  );
}
