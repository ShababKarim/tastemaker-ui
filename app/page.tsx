import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="hero min-h-[70vh] bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10">
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&q=60"
          alt="An assortment of dishes on a table"
          width={600}
          height={400}
          className="rounded-lg shadow-2xl"
          priority
        />
        <div>
          <h1 className="text-5xl font-bold">Tastemaker</h1>
          <p className="py-6 text-lg max-w-xl">
            Your personal food & drink journal. Review restaurants, rank your favorite dishes, and follow friends to discover what they love.
          </p>
          <div className="flex gap-3">
            <Link href="/profile/alex" className="btn btn-primary">Go to your profile</Link>
            <Link href="#features" className="btn btn-ghost">Learn more</Link>
          </div>
        </div>
      </div>
      <section id="features" className="container mx-auto px-4 mt-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Track</h2>
              <p>Keep notes, prices, and ratings for dishes you try.</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Discover</h2>
              <p>Browse places your friends loved and what they ordered.</p>
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Remember</h2>
              <p>Photos and notes make it easy to relive your best bites.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
