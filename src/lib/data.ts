import { User, PlaceReview, Place, PlaceAndReview, PlaceReviewInput } from '@/lib/types';
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

export async function getReviewsAndPlacesByUser(userId: string): Promise<PlaceAndReview[]> {
  const reviews = await getReviewsByUser(userId);

  return reviews.map((review) => ({ review, place: MOCK_PLACES[review.placeId] }));
}

export async function getTopReviewsFromFollowers(placeId: string): Promise<PlaceReview[]> {
  // Logic should live in backend; should be limited to 5
  const user = await getCurrentUser();

  return MOCK_PLACE_REVIEWS[placeId].filter((review) => user.following.includes(review.userId));
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export async function savePlaceReview(input: PlaceReviewInput): Promise<PlaceReview> {
  const review: PlaceReview = {
    id: uid('review'),
    userId: input.userId,
    placeId: input.placeId,
    rating: input.rating,
    rank: input.rank,
    items: input.items.map((it) => ({
      ...it,
      id: uid('item'),
      createdAt: new Date().toISOString(),
    })),
  };

  if (!MOCK_PLACE_REVIEWS[input.placeId]) {
    MOCK_PLACE_REVIEWS[input.placeId] = [];
  }
  MOCK_PLACE_REVIEWS[input.placeId].push(review);
  return review;
}
