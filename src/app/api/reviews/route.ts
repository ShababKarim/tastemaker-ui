import { NextRequest, NextResponse } from 'next/server';
import { savePlaceReview } from '@/lib/data';
import { PlaceReviewInput } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlaceReviewInput;

    // Basic validation
    if (!body?.userId || !body?.placeId || typeof body.rating !== 'number' || typeof body.rank !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    const saved = await savePlaceReview(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
