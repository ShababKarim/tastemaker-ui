import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { getSessionUserFromCookies } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getSessionUserFromCookies();
  if (user) {
    redirect(`/profile/${user.id}`);
  }

  return (
    <div className="min-h-[60vh] w-full grid place-items-center">
      <LoginForm />
    </div>
  );
}
