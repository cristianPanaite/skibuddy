import { NextResponse } from 'next/server';
import { getInstructorDetail } from '@/lib/instructors';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const instructor = await getInstructorDetail(params.id);
  if (!instructor) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: instructor });
}
