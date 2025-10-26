'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { WhatsAppButton } from './WhatsAppButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { LanguageChips } from './LanguageChips';
import { FeaturedBadge, VerifiedBadge } from './Badges';
import { formatPrice } from '@/lib/utils';
import type { InstructorSummary } from '@/types/instructor';

interface InstructorCardProps {
  instructor: InstructorSummary;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex flex-col gap-3 pb-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100">
          {instructor.photoUrl ? (
            <Image
              src={instructor.photoUrl}
              alt={instructor.name}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl font-semibold">{instructor.name}</CardTitle>
          {instructor.verified ? <VerifiedBadge /> : null}
          {instructor.featured ? <FeaturedBadge /> : null}
        </div>
        <p className="text-sm text-slate-500">{instructor.resort.name}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <LanguageChips languages={instructor.languages} />
        <div className="text-lg font-semibold text-brand-700">
          {formatPrice(instructor.pricePerHourCents)}/hour
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        {instructor.whatsapp ? (
          <WhatsAppButton
            className="w-full"
            phone={instructor.whatsapp}
            instructorId={instructor.id}
          />
        ) : (
          <Button className="w-full" disabled>WhatsApp unavailable</Button>
        )}
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/instructors/${instructor.id}`}>View profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
