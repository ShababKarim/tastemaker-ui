"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const mockCurrentUser = {
  username: "alex",
  name: "Alex Chen",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format&q=60"
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Tastemaker</Link>
        </div>
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1 hidden sm:flex">
            <li><Link href="/">Home</Link></li>
          </ul>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" aria-label="Open profile menu">
              <div className="w-10 rounded-full">
                <Image src={mockCurrentUser.avatar} alt={mockCurrentUser.name} width={40} height={40} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link href={`/profile/${mockCurrentUser.username}`}>Profile</Link>
              </li>
              <li>
                <Link href="/">Settings (coming soon)</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
