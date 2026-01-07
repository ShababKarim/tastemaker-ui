import Image from 'next/image';
import Link from 'next/link';
import { getPlace, getReviewsFromFollowersForPlace } from '@/lib/data';
import { getSessionUserFromCookies } from '@/lib/auth';
import PlaceReviewCard from '@/components/PlaceReviewCard';
import LoginButton from '@/components/LoginButton';
import PlaceMap from '@/components/PlaceMap';

function getCityAndState(address: string): string {
  return address.split(', ').slice(-2).join(', ');
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: placeId } = await params;
  const currentUser = await getSessionUserFromCookies();
  const [place, followedReviews] = await Promise.all([
    getPlace(placeId),
    getReviewsFromFollowersForPlace(placeId, currentUser),
  ]);

  if (!place) {
    return (
      <div className="prose">
        <h1>Place not found</h1>
        <p>The place with ID &quot;{placeId}&quot; does not exist.</p>
        <Link href="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  // Calculate summary statistics
  const totalReviews = followedReviews.length;
  const averageRating =
    totalReviews > 0 ? followedReviews.reduce((sum, { review }) => sum + review.rating, 0) / totalReviews : 0;
  const averageRank =
    totalReviews > 0 ? followedReviews.reduce((sum, { review }) => sum + review.rank, 0) / totalReviews : 0;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Place Info */}
          <div className="space-y-6">
            {/* Stylish Header Section */}
            <div className="text-center py-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h1 className="text-5xl font-bold text-base-content mb-2">{place.name}</h1>
              <div className="flex items-center justify-center gap-2 text-base-content/70">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{getCityAndState(place.address)}</span>
              </div>
            </div>

            {/* Image with Address Below */}
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image src={place.photoUrl} alt={place.name} fill className="object-cover rounded-lg" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-base-content/70">{place.address}</p>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-base-content/80 leading-relaxed">{place.description}</p>
            </div>
          </div>

          {!currentUser ? (
            <div className="bg-base-200 rounded-lg p-6 text-center">
              {/* Login Prompt for Non-Authenticated Users */}
              <h2 className="text-xl font-semibold mb-3">See What Your Friends Think</h2>
              <p className="text-base-content/70 mb-4">Sign in to see reviews from people you follow.</p>
              <LoginButton />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Right Side - Reviews */}
              {/* Summary Statistics */}
              <div className="bg-base-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Review Summary</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{totalReviews}</div>
                    <div className="text-sm text-base-content/70">Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{averageRating.toFixed(1)} ★</div>
                    <div className="text-sm text-base-content/70">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{averageRank.toFixed(1)}</div>
                    <div className="text-sm text-base-content/70">Avg Rank</div>
                  </div>
                </div>
              </div>

              {/* Scrollable Reviews */}
              <div className="bg-base-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">People You Follow</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {followedReviews.length === 0 ? (
                    <p className="text-base-content/60 text-center py-8">No reviews from people you follow yet.</p>
                  ) : (
                    followedReviews.map(({ review }) => <PlaceReviewCard key={review.id} review={review} />)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Directions</h2>
          <p className="text-base-content/70 mb-6">
            Click on the map to get directions from your current location to {place.name}
          </p>
          <PlaceMap place={place} />
        </div>
      </div>
    </div>
  );
}
