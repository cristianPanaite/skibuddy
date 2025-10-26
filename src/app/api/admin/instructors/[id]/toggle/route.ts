import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { toggleInstructorFlag } from '@/lib/instructors';

interface Params {
  params: {
    id: string;
  };
}

const schema = z.object({
  field: z.enum(['featured', 'verified']),
  value: z.boolean()
});

export async function POST(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = schema.parse(body);

    await toggleInstructorFlag(params.id, parsed.field, parsed.value);

    return NextResponse.json({ success: true });
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
    return NextResponse.json({ message: 'Unable to update instructor' }, { status: 500 });
  }
}
