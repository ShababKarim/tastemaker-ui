import Image from 'next/image'
import Link from 'next/link'
import { getUserByUsername } from '@/lib/data'

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const user = getUserByUsername(params.username)

  if (!user) {
    return (
      <div className="prose">
        <h1>User not found</h1>
        <p>The profile for "{params.username}" does not exist.</p>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <Image src={user.avatar} alt={user.name} width={80} height={80} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-base-content/70">@{user.username}</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviewed Restaurants</h2>
        {user.reviews.length === 0 ? (
          <p className="text-base-content/70">No reviews yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.reviews.map(({ restaurant, dishes }) => (
              <div key={restaurant.id} className="card bg-base-200 shadow-sm">
                <figure>
                  <Image src={restaurant.photo} alt={restaurant.name} width={600} height={400} className="w-full h-48 object-cover" />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{restaurant.name}</h3>
                  <p className="text-sm text-base-content/70">{restaurant.address}</p>
                  <p className="text-sm">{dishes.length} dishes reviewed</p>
                  <div className="card-actions justify-end">
                    <Link className="btn btn-primary btn-sm" href={`/profile/${user.username}/restaurant/${restaurant.id}`}>
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
  )
}
