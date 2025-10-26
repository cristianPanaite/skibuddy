import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listInstructors, upsertInstructorForUser } from '@/lib/instructors';
import { requireSessionUser } from '@/lib/auth';

const createInstructorSchema = z.object({
  name: z.string().min(2),
  photoUrl: z.string().url().nullable().optional(),
  languages: z.array(z.string().min(2)).min(1),
  pricePerHour: z.number().min(0),
  whatsapp: z.string().min(5).max(20).nullable().optional(),
  instagram: z.string().max(60).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  resortId: z.string().min(1),
  tags: z.array(z.string()).default([])
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resort = url.searchParams.get('resort') ?? undefined;
  const maxPriceParam = url.searchParams.get('maxPrice');
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
  const language = url.searchParams.get('language') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;
  const pageParam = url.searchParams.get('page');
  const page = pageParam ? Number(pageParam) : 1;
  const perPageParam = url.searchParams.get('perPage');
  const perPage = perPageParam ? Number(perPageParam) : 12;

  const { records, total } = await listInstructors({
    resort,
    maxPrice: maxPrice !== undefined && !Number.isNaN(maxPrice) ? maxPrice : undefined,
    language,
    q,
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    perPage: Number.isNaN(perPage) || perPage < 1 ? 12 : perPage
  });

  return NextResponse.json({ data: records, meta: { total, page, perPage } });
}

export async function POST(request: Request) {
  try {
    const sessionUser = await requireSessionUser();
    const body = await request.json();
    const parsed = createInstructorSchema.parse(body);

    const instructor = await upsertInstructorForUser(sessionUser.id, {
      name: parsed.name,
      photoUrl: parsed.photoUrl ?? undefined,
      languages: parsed.languages,
      pricePerHourCents: Math.round(parsed.pricePerHour * 100),
      whatsapp: parsed.whatsapp ?? undefined,
      instagram: parsed.instagram ?? undefined,
      bio: parsed.bio ?? undefined,
      resortId: parsed.resortId,
      tags: parsed.tags
    });

    return NextResponse.json({ data: { id: instructor.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }
    return NextResponse.json({ message: 'Unable to save instructor' }, { status: 500 });
  }
}
