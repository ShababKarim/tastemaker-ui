import Link from 'next/link';
import { getCurrentUser, getPlace } from '@/lib/data';
import { ItemCategory, ItemReviewInput } from '@/lib/types';
import PlaceReviewFormWrapper from '@/components/PlaceReviewFormWrapper';

function emptyItem(): ItemReviewInput {
  return {
    name: '',
    category: 'Entree' as ItemCategory,
    price: '',
    rating: 0,
    rank: 1,
    notes: '',
  };
}

export default async function PlaceReviewPage({ params }: { params: Promise<{ id: string; placeId: string }> }) {
  const { id, placeId } = await params;
  const user = await getCurrentUser();
  const place = await getPlace(placeId);

  if (!user || !place) {
    return (
      <div className="prose">
        <h1>Not found</h1>
        <p>User or place could not be found.</p>
        <Link href={`/profile/${id}`} className="btn btn-primary">
          Back to profile
        </Link>
      </div>
    );
  }

  const initialValue = {
    userId: user.id,
    placeId: place.id,
    rating: 0,
    rank: 1,
    items: [emptyItem()],
  };

  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href={`/profile/${user.id}`}>{user.username}</Link>
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

      <PlaceReviewFormWrapper value={initialValue} userId={user.id} place={place} />
    </div>
  );
}
