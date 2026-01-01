import Image from 'next/image';
import Link from 'next/link';
import { getReviewsAndPlacesByUser, getUser } from '@/lib/data';
import ReviewsInfoSection from '@/components/ReviewsInfoSection';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  const reviews = await getReviewsAndPlacesByUser(id);

  if (!user) {
    return (
      <div className="prose">
        <h1>User not found</h1>
        <p>The profile for &quot;{id}&quot; does not exist.</p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <Image src={user.avatarUrl} alt={user.name} width={80} height={80} />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-semibold">{user.name}</h1>
          <p className="text-lg text-base-content/70">@{user.username}</p>
          <div className="flex gap-4 mt-2 items-center justify-center">
            <div className="text-center">
              <div className="font-semibold">{user.followingCount}</div>
              <div className="text-md text-base-content/70">Following</div>
            </div>
            <div className="divider divider-horizontal h-8 mx-0"></div>
            <div className="text-center">
              <div className="font-semibold">{user.followerCount}</div>
              <div className="text-md text-base-content/70">Followers</div>
            </div>
            <div className="divider divider-horizontal h-8 mx-0"></div>
            <div className="text-center">
              <ReviewsInfoSection userName={user.username} reviewCount={reviews.length} />
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl text-secondary font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-base-content/70">No reviews yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(({ review, place }) => (
              <div key={place.id} className="card bg-base-200 shadow-sm">
                <figure>
                  <Image
                    src={place.photoUrl}
                    alt={place.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{place.name}</h3>
                  <p className="text-sm text-base-content/70">{place.address}</p>
                  <p className="text-sm">
                    {review.items.length === 1 ? '1 dish reviewed' : `${review.items.length} dishes reviewed`}
                  </p>
                  <div className="card-actions justify-end">
                    <Link className="btn btn-primary btn-sm" href={`/user/${user.id}/reviews/${place.id}`}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
