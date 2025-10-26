import { requireAdmin } from '@/lib/auth';
import { listAllInstructors } from '@/lib/instructors';
import { AdminTable } from './AdminTable';

export default async function AdminPage() {
  await requireAdmin();
  const instructors = await listAllInstructors();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="text-slate-600">
          Toggle featured and verified badges to highlight the best instructors.
        </p>
      </div>
      <AdminTable
        instructors={instructors.map((instructor) => ({
          id: instructor.id,
          name: instructor.name,
          featured: instructor.featured,
          verified: instructor.verified,
          resort: instructor.resort.name,
          languages: instructor.languages
        }))}
      />
    </main>
  );
}
