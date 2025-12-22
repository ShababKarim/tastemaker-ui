import Image from 'next/image'
import Link from 'next/link'
import { getRestaurantFromUser } from '@/lib/data'

export default function RestaurantPage({ params }: { params: { username: string, restaurantId: string } }) {
  const review = getRestaurantFromUser(params.username, params.restaurantId)

  if (!review) {
    return (
      <div className="prose">
        <h1>Restaurant not found</h1>
        <p>We couldn't find that restaurant review for @{params.username}.</p>
        <Link href={`/profile/${params.username}`} className="btn btn-primary">Back to profile</Link>
      </div>
    )
  }

  const { restaurant, dishes } = review

  return (
    <div className="space-y-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li><Link href={`/profile/${params.username}`}>@{params.username}</Link></li>
          <li>{restaurant.name}</li>
        </ul>
      </div>

      <div className="card bg-base-200">
        <figure>
          <Image src={restaurant.photo} alt={restaurant.name} width={1200} height={600} className="w-full h-64 object-cover" />
        </figure>
        <div className="card-body">
          <h1 className="card-title text-3xl">{restaurant.name}</h1>
          <p className="text-base-content/70">{restaurant.address}</p>
          <p className="text-xs text-base-content/60">Google Place ID (mocked): {restaurant.placeId}</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviewed Dishes</h2>
        {dishes.length === 0 ? (
          <p className="text-base-content/70">No dishes reviewed yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <div key={dish.id} className="card bg-base-100 border border-base-200">
                <figure>
                  <Image src={dish.photo} alt={dish.name} width={600} height={400} className="w-full h-48 object-cover" />
                </figure>
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h3 className="card-title text-xl">{dish.name}</h3>
                    <div className="badge badge-primary">{dish.rank.toFixed(1)}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="badge badge-ghost">{dish.category}</div>
                    <div className="badge badge-outline">${dish.price.toFixed(2)}</div>
                  </div>
                  <p className="text-sm text-base-content/80">{dish.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
