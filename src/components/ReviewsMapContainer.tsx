import ReviewsMap from '@/components/ReviewsMap';
import { getPlaceAndReviewsDetails, getReviewsFromFollowedUsers } from '@/lib/data';
import { PlaceAndReview, User } from '@/lib/types';

interface ReviewsMapContainerProps {
  user: User;
  reviews: PlaceAndReview[];
}

export default async function ReviewsMapContainer({ user, reviews }: ReviewsMapContainerProps) {
  const followedReviews = await getReviewsFromFollowedUsers(user.id);
  const placeAndReviewsDetails = getPlaceAndReviewsDetails(reviews.concat(followedReviews), user.id);

  return <ReviewsMap user={user} placeAndReviewsDetails={placeAndReviewsDetails} />;
}
