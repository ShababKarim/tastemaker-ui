import Link from 'next/link';
import { getSessionUserFromCookies } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import LoginButton from '@/components/LoginButton';

export default async function Navbar() {
  const user = await getSessionUserFromCookies();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 font-mono">
      <div className="flex-none">
        <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
          <span className="text-primary">Taste</span>maker
        </Link>
      </div>
      <div className="flex-auto gap-4 flex flex-row">
        {/* Search Bar */}
        <div className="form-control hidden sm:block flex-grow relative">
          <label className="input w-full max-w-5xl rounded-full">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="text" placeholder="Search for cravings..." />
          </label>
        </div>

        {/* User Profile Dropdown */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="flex gap-1 items-center pr-2 cursor-pointer no-hover">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src={user.avatarUrl} />
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={`/user/${user.id}`} className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/">Settings</Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center">
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
