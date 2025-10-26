import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    title: 'Book faster',
    description: 'Browse verified instructors and contact them directly without waiting for callbacks.'
  },
  {
    title: 'Local expertise',
    description: 'Every instructor knows Poiana Brașov and Sinaia like the back of their glove.'
  },
  {
    title: 'Flexible languages',
    description: 'Filter instructors by English, Romanian, German, and more so lessons run smoothly.'
  }
];

const resorts = [
  { slug: 'poiana-brasov', name: 'Poiana Brașov' },
  { slug: 'sinaia', name: 'Sinaia' }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16">
      <section className="grid gap-8 text-center md:grid-cols-2 md:text-left">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            SkiBuddy Poiana Brașov
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Find the perfect ski instructor for your next mountain day.
          </h1>
          <p className="text-lg text-slate-600">
            Browse featured and verified instructors, compare pricing, and reach out on WhatsApp in a
            tap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button asChild size="lg">
              <Link href="/instructors">Find instructors</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/join">List your profile</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-72 w-full max-w-md rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-left text-white shadow-xl">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wide text-brand-100">Featured instructor</p>
              <h2 className="text-3xl font-semibold">Alex Popescu</h2>
              <p className="text-brand-100">
                “I love helping families conquer their first red runs in Poiana Brașov. Let’s ski!”
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-brand-50">
                <span className="rounded-full bg-white/20 px-3 py-1">EN</span>
                <span className="rounded-full bg-white/20 px-3 py-1">RO</span>
                <span className="rounded-full bg-white/20 px-3 py-1">DE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardHeader>
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Popular resorts</h2>
        <div className="flex flex-wrap gap-2">
          {resorts.map((resort) => (
            <Link
              key={resort.slug}
              href={`/instructors?resort=${resort.slug}`}
              className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition hover:border-brand-500 hover:text-brand-900"
            >
              {resort.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
