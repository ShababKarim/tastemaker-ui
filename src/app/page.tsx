'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 font-sans">
      {/* 1. HERO SECTION */}
      <section className="hero min-h-[80vh] relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="hero-content text-center z-10 max-w-4xl">
          <div className="">
            <div className="badge badge-outline mb-6 opacity-70">v1.0 Public Beta</div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-base-content mb-6">
              The Social Media for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Gastronomy
              </span>
            </h1>
            <p className="py-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Stop relying on aggregate 5-star ratings. Tastemaker allows you to log specific dishes, rank your
              favorites, and follow the opinions you trust.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
              <a
                href="#signup"
                className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-primary/50 transition-all"
              >
                Start Curating
              </a>
              <Link href="/profile/user_1" className="btn btn-ghost btn-lg rounded-full">
                View Demo Profile →
              </Link>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="mt-16 mockup-window border bg-base-300 border-base-300 shadow-2xl max-w-3xl mx-auto transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-center px-4 py-16 bg-base-200 opacity-50">
                <span className="loading loading-dots loading-lg text-primary"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION (Grid) */}
      <section className="py-24 bg-base-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Why Tastemaker?</h2>
            <p className="text-gray-500 mt-2">We&apos;re building the tool we wanted to use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary text-2xl">
                  🍽️
                </div>
                <h3 className="card-title text-xl">Dish-Level Data</h3>
                <p className="text-gray-500 mt-2">
                  A restaurant is more than one rating. Review specific items, from the appetizer to the espresso.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 text-secondary text-2xl">
                  🏆
                </div>
                <h3 className="card-title text-xl">Personal Rankings</h3>
                <p className="text-gray-500 mt-2">
                  Create definitive lists. &quot;Best Burgers in NYC&quot; or &quot;Top 10 Vegan Spots&quot;. Your
                  taste, your hierarchy.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent text-2xl">
                  🤝
                </div>
                <h3 className="card-title text-xl">Social Discovery</h3>
                <p className="text-gray-500 mt-2">
                  Follow friends and critics. See what *they* ordered, not what a random algorithm suggests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MOCK "TRUSTED BY" SECTION */}
      <section className="py-12 border-y border-base-300 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">
            Inspired by the world&quot;s best kitchens
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            {/* Simple text placeholders for logos to keep it clean */}
            <span className="text-2xl font-serif font-bold">Eater</span>
            <span className="text-2xl font-serif font-bold">The Infatuation</span>
            <span className="text-2xl font-serif font-bold">Bon Appétit</span>
            <span className="text-2xl font-serif font-bold">Michelin Guide</span>
          </div>
        </div>
      </section>

      {/* 4. SIGN UP SECTION */}
      <section id="signup" className="py-24 bg-base-100 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Join the Waitlist</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
            We are currently rolling out access to a select group of beta testers. Secure your handle today.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            {status === 'success' ? (
              <div className="alert alert-success shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Welcome to the club! Check your inbox.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered input-lg w-full focus:outline-none focus:border-primary"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button type="submit" className="btn btn-primary btn-lg px-8" disabled={status === 'loading'}>
                  {status === 'loading' ? <span className="loading loading-spinner"></span> : 'Request Access'}
                </button>
              </>
            )}
          </form>
          <p className="text-xs text-gray-400 mt-6">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <aside>
          <p>© 2025 Tastemaker</p>
        </aside>
      </footer>
    </div>
  );
}
