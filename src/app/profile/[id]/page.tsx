import Image from 'next/image';
import Link from 'next/link';
import { getReviewedPlacesByUser, getReviewsByUser, getUser } from '@/lib/data';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  const reviews = await getReviewsByUser(id);
  const reviewedPlaces = await getReviewedPlacesByUser(id);

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
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <Image src={user.avatarUrl} alt={user.name} width={80} height={80} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-base-content/70">@{user.username}</p>
          <div className="flex gap-4 mt-2 items-center">
            <div className="text-center">
              <div className="font-bold">{user.followingCount}</div>
              <div className="text-xs text-base-content/70">Following</div>
            </div>
            <div className="divider divider-horizontal h-8 mx-0"></div>
            <div className="text-center">
              <div className="font-bold">{user.followerCount}</div>
              <div className="text-xs text-base-content/70">Followers</div>
            </div>
            <div className="divider divider-horizontal h-8 mx-0"></div>
            <div className="text-center">
              <div className="font-bold">{reviewedPlaces.length}</div>
              <div className="text-xs text-base-content/70">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviewed Restaurants</h2>
        {reviews.length === 0 ? (
          <p className="text-base-content/70">No reviews yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewedPlaces.map((place) => (
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
                  {/*TODO: add how many dishes reviewed in each place*/}
                  {/*<p className="text-sm">{reviewedItems.length} dish(es) reviewed</p>*/}
                  <div className="card-actions justify-end">
                    <Link className="btn btn-primary btn-sm" href={`/profile/${user.id}/restaurant/${place.id}`}>
                      View dishes
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
