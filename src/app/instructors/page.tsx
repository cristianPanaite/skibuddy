import { Suspense } from 'react';
import { listInstructors, getResorts, getAvailableLanguages } from '@/lib/instructors';
import { Filters } from '@/components/ui/Filters';
import { InstructorCard } from '@/components/ui/InstructorCard';
import { Button } from '@/components/ui/button';

interface InstructorsPageProps {
  searchParams?: {
    resort?: string;
    maxPrice?: string;
    language?: string;
    q?: string;
    page?: string;
  };
}

async function InstructorsGrid({
  searchParams
}: Pick<InstructorsPageProps, 'searchParams'>) {
  const resortSlug = searchParams?.resort;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const language = searchParams?.language;
  const q = searchParams?.q;
  const page = searchParams?.page ? Number(searchParams.page) : 1;

  const perPage = 12;

  const [{ records, total }, resorts, languages] = await Promise.all([
    listInstructors({ resort: resortSlug, maxPrice, language, q, page, perPage }),
    getResorts(),
    getAvailableLanguages()
  ]);

  const hasMore = page * perPage < total;
  const hasPrev = page > 1;

  return (
    <div className="space-y-10">
      <Filters resorts={resorts} availableLanguages={languages} />
      {records.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500">No instructors matched your filters.</p>
      )}
      <div className="flex justify-center gap-4">
        {hasPrev ? (
          <form action="">
            <input type="hidden" name="page" value={page - 1} />
            {resortSlug ? <input type="hidden" name="resort" value={resortSlug} /> : null}
            {maxPrice ? <input type="hidden" name="maxPrice" value={maxPrice} /> : null}
            {language ? <input type="hidden" name="language" value={language} /> : null}
            {q ? <input type="hidden" name="q" value={q} /> : null}
            <Button type="submit" variant="ghost">Previous</Button>
          </form>
        ) : null}
        {hasMore ? (
          <form action="">
            <input type="hidden" name="page" value={page + 1} />
            {resortSlug ? <input type="hidden" name="resort" value={resortSlug} /> : null}
            {maxPrice ? <input type="hidden" name="maxPrice" value={maxPrice} /> : null}
            {language ? <input type="hidden" name="language" value={language} /> : null}
            {q ? <input type="hidden" name="q" value={q} /> : null}
            <Button type="submit" variant="secondary">Next page</Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-10 space-y-3 text-center md:text-left">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Find your instructor</h1>
        <p className="text-slate-600">
          Filter by resort, price, or language to find the perfect match for your next lesson.
        </p>
      </div>
      <Suspense fallback={<p>Loading instructors…</p>}>
        <InstructorsGrid searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
