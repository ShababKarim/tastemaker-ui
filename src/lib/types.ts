export type ItemCategory = 'Entree' | 'App' | 'Dessert' | 'Drink';

export type ItemReview = {
  id: string;
  name: string;
  category: ItemCategory;
  price: string;
  rating: number;
  rank: number;
  photoUrl: string;
  notes: string;
  createdAt: string;
};

export type Place = {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
};

export type PlaceReview = {
  id: string;
  userId: string;
  placeId: string;
  rating: number;
  rank: number;
  items: ItemReview[];
};

export type PlaceAndReview = {
  place: Place;
  review: PlaceReview;
};

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  following: string[];
  followingCount: number;
  followerCount: number;
};
