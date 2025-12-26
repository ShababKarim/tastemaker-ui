'use server';

import { revalidatePath } from 'next/cache';

type FormState = {
  errors: string | null;
};

export async function submitPlaceReview(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log('Saving place review...');

  await new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, 300);
  });

  console.log('Saved place review, ', JSON.stringify(Object.fromEntries(formData)));

  revalidatePath('/');

  return { errors: null };
}
