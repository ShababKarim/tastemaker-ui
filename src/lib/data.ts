import { User, PlaceReview, Place, PlaceAndReview, PlaceAndReviewsDetails } from '@/lib/types';
import { MOCK_PLACE_REVIEWS, MOCK_PLACES, MOCK_USERS } from '@/lib/mocks';
import { FIELD_REPLACE_VALUE } from '@/lib/constants';

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

export async function getReviewsFromFollowedUsers(userId: string): Promise<PlaceAndReview[]> {
  const user = await getUser(userId);
  const followedReviews: PlaceAndReview[] = [];

  for (const followedUserId of user.following) {
    const reviews = await getReviewsByUser(followedUserId);
    reviews.forEach((review) => {
      followedReviews.push({ review, place: MOCK_PLACES[review.placeId] });
    });
  }

  return followedReviews;
}

export async function getTopReviewsFromFollowers(placeId: string): Promise<PlaceReview[]> {
  // Logic should live in backend; should be limited to 5
  const user = await getCurrentUser();

  return MOCK_PLACE_REVIEWS[placeId].filter((review) => user.following.includes(review.userId));
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

// TODO: implement in backend
export async function savePlaceReview(input: PlaceReview): Promise<PlaceReview> {
  const review: PlaceReview = {
    id: hasReplaceValue(input.id) ? uid('review') : input.id,
    userId: input.userId,
    placeId: input.placeId,
    rating: input.rating,
    rank: input.rank,
    items: input.items.map((it) => ({
      ...it,
      id: hasReplaceValue(it.id) ? uid('item') : it.id,
      createdAt: hasReplaceValue(it.createdAt) ? new Date().toISOString() : it.createdAt,
    })),
  };

  // simulate delay
  await new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, 300);
  });

  if (!MOCK_PLACE_REVIEWS[input.placeId]) {
    MOCK_PLACE_REVIEWS[input.placeId] = [];
  }
  MOCK_PLACE_REVIEWS[input.placeId] = [
    ...MOCK_PLACE_REVIEWS[input.placeId].filter((review) => review.id !== input.id),
  ].concat(input);

  return review;
}

export function getPlaceAndReviewsDetails(placeAndReviews: PlaceAndReview[], userId: string): PlaceAndReviewsDetails {
  return placeAndReviews.reduce((acc, placeAndReview) => {
    const { place } = placeAndReview;
    const placeAndReviewsDetails = { ...acc };

    if (!(place.id in placeAndReviewsDetails)) {
      placeAndReviewsDetails[place.id] = {
        place,
        visited: false,
        count: 0,
      };
    }

    placeAndReviewsDetails[place.id] = {
      ...placeAndReviewsDetails[place.id],
      visited: placeAndReviewsDetails[place.id].visited || placeAndReview.review.userId === userId,
      count: placeAndReviewsDetails[place.id].count + 1,
    };

    return placeAndReviewsDetails;
  }, {} as PlaceAndReviewsDetails);
}

export function isCurrentUser(currentUser: User | null, user: User): boolean {
  return currentUser !== null && currentUser.id === user.id;
}

function hasReplaceValue(field: string): boolean {
  return field === FIELD_REPLACE_VALUE;
}
