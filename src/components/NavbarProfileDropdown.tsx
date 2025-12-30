import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { getSessionUserFromCookies } from '@/lib/auth';

export default async function NavbarProfileDropdown() {
  const user = await getSessionUserFromCookies();

  return (
    <>
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
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <Link href={`/profile/${user.id}`} className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex items-center">
          <Link href="/login" className="btn btn-sm">
            Log in
          </Link>
        </div>
      )}
    </>
  );
}
