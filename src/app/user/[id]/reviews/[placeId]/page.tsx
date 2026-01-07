import Link from 'next/link';
import { getPlace, getReview, getUser, isCurrentUser } from '@/lib/data';
import { getSessionUserFromCookies } from '@/lib/auth';
import { ItemCategory, ItemReview, PlaceReview } from '@/lib/types';
import { FIELD_REPLACE_VALUE } from '@/lib/constants';
import PlaceReviewForm from '@/components/PlaceReviewForm';

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
  const [user, currentUser, place] = await Promise.all([
    getUser(userId),
    getSessionUserFromCookies(),
    getPlace(placeId),
  ]);
  const isPageOwner = isCurrentUser(currentUser, user);

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
    <div className="min-h-screen bg-base-100 space-y-6">
      <div className="container mx-auto px-4 py-8">
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
        {isPageOwner ? (
          <>
            <h1 className="text-3xl font-bold">Review {place.name}</h1>
            <p className="text-base-content/70">
              Add one or more items you tried at this place. Use the + button to add more.
            </p>
          </>
        ) : (
          <h1 className="text-3xl font-bold">{place.name}</h1>
        )}
        <PlaceReviewForm place={place} value={review ?? initialValue} readOnly={!isPageOwner} />
      </div>
    </div>
  );
}
