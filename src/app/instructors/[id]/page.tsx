import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInstructorDetail } from '@/lib/instructors';
import { formatPrice } from '@/lib/utils';
import { LanguageChips } from '@/components/ui/LanguageChips';
import { FeaturedBadge, VerifiedBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

interface InstructorProfilePageProps {
  params: {
    id: string;
  };
}

export default async function InstructorProfilePage({ params }: InstructorProfilePageProps) {
  const instructor = await getInstructorDetail(params.id);

  if (!instructor || !instructor.active) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[280px,1fr]">
        <div className="space-y-4">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-100">
            {instructor.photoUrl ? (
              <Image
                src={instructor.photoUrl}
                alt={instructor.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 280px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No photo</div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">{instructor.resort.name}</p>
            <div className="text-2xl font-semibold text-slate-900">{formatPrice(instructor.pricePerHourCents)}/hour</div>
            <LanguageChips languages={instructor.languages} />
          </div>
          <div className="flex flex-col gap-2">
            {instructor.whatsapp ? (
              <WhatsAppButton phone={instructor.whatsapp} instructorId={instructor.id} className="w-full" />
            ) : null}
            {instructor.instagram ? (
              <Button asChild variant="secondary" className="w-full">
                <Link
                  href={instructor.instagram.startsWith('http') ? instructor.instagram : `https://instagram.com/${instructor.instagram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Instagram
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-slate-900">{instructor.name}</h1>
              {instructor.verified ? <VerifiedBadge /> : null}
              {instructor.featured ? <FeaturedBadge /> : null}
            </div>
            {instructor.bio ? <p className="text-lg leading-relaxed text-slate-600">{instructor.bio}</p> : null}
          </div>
          {instructor.tags.length ? (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Specialities</h2>
              <div className="flex flex-wrap gap-2">
                {instructor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
