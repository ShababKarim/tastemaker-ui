import { User, PlaceReview, Place } from '@/lib/types';
import { MOCK_PLACE_REVIEWS, MOCK_PLACES, MOCK_USERS } from '@/lib/mocks';

export async function getCurrentUser(): Promise<User> {
  return MOCK_USERS['user_1'];
}

export async function getUser(id: string): Promise<User> {
  return MOCK_USERS[id];
}

export async function getPlace(id: string): Promise<Place> {
  return MOCK_PLACES[id];
}

export async function getReview(placeId: string, userId: string): Promise<PlaceReview | undefined> {
  return MOCK_PLACE_REVIEWS[placeId].filter((review) => review.userId === userId).at(0);
}

export async function getReviewsByUser(userId: string): Promise<PlaceReview[]> {
  const reviews: PlaceReview[] = [];

  Object.values(MOCK_PLACE_REVIEWS).forEach((placeReviews) => {
    reviews.push(...placeReviews.filter((review) => review.userId === userId));
  });

  return reviews;
}

export async function getReviewedPlacesByUser(userId: string): Promise<Place[]> {
  const placeIds: string[] = [];

  Object.values(MOCK_PLACE_REVIEWS).forEach((placeReviews) => {
    placeIds.push(...placeReviews.filter((review) => review.userId === userId).map((review) => review.placeId));
  });

  return placeIds.map((id) => MOCK_PLACES[id]);
}

export async function getTopReviewsFromFollowers(placeId: string): Promise<PlaceReview[]> {
  // Logic should live in backend; should be limited to 5
  const user = await getCurrentUser();

  return MOCK_PLACE_REVIEWS[placeId].filter((review) => user.following.includes(review.userId));
}
