import usersJson from '@/data/mock/users.json'

export type DishCategory = 'Entree' | 'App' | 'Dessert' | 'Drink'

export type Dish = {
  id: string
  name: string
  category: DishCategory
  price: number
  rank: number
  photo: string
  notes: string
}

export type Restaurant = {
  id: string
  name: string
  address: string
  placeId: string
  photo: string
}

export type RestaurantReview = {
  restaurant: Restaurant
  dishes: Dish[]
}

export type User = {
  id: string
  username: string
  name: string
  avatar: string
  following: string[]
  reviews: RestaurantReview[]
}

export type UsersData = {
  users: User[]
}

const data = usersJson as UsersData

export function getUsers(): User[] {
  return data.users
}

export function getUserByUsername(username: string): User | undefined {
  return data.users.find(u => u.username.toLowerCase() === username.toLowerCase())
}

export function getRestaurantFromUser(username: string, restaurantId: string): RestaurantReview | undefined {
  const user = getUserByUsername(username)
  if (!user) return undefined
  return user.reviews.find(r => r.restaurant.id === restaurantId)
}
