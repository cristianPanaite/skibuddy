import { requireSessionUser } from '@/lib/auth';
import {
  getInstructorForUser,
  getResorts,
  getTags,
  getAvailableLanguages
} from '@/lib/instructors';
import { JoinForm } from './JoinForm';

const DEFAULT_LANGUAGES = ['RO', 'EN', 'DE', 'FR', 'IT', 'HU'];

export default async function JoinPage() {
  const sessionUser = await requireSessionUser();

  const [instructor, resorts, tags, existingLanguages] = await Promise.all([
    getInstructorForUser(sessionUser.id),
    getResorts(),
    getTags(),
    getAvailableLanguages()
  ]);

  const languageOptions = Array.from(
    new Set([...(instructor?.languages ?? []), ...existingLanguages, ...DEFAULT_LANGUAGES])
  ).sort();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">
          {instructor ? 'Update your instructor profile' : 'Become a SkiBuddy instructor'}
        </h1>
        <p className="text-slate-600">
          Tell skiers about your experience, pricing, and languages. You can update this anytime.
        </p>
      </div>
      <JoinForm
        instructor={
          instructor
            ? {
                name: instructor.name,
                photoUrl: instructor.photoUrl,
                languages: instructor.languages,
                pricePerHourCents: instructor.pricePerHourCents,
                whatsapp: instructor.whatsapp,
                instagram: instructor.instagram,
                bio: instructor.bio,
                resortId: instructor.resortId,
                tags: instructor.tags.map((tag) => tag.tag.label)
              }
            : null
        }
        resorts={resorts.map((resort) => ({ id: resort.id, name: resort.name }))}
        tags={tags.map((tag) => ({ id: tag.id, label: tag.label }))}
        languageOptions={languageOptions}
      />
    </main>
  );
}
