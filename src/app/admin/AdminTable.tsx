'use client';

import { useState, useMemo, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';

interface AdminInstructor {
  id: string;
  name: string;
  featured: boolean;
  verified: boolean;
  resort: string;
  languages: string[];
}

interface AdminTableProps {
  instructors: AdminInstructor[];
}

export function AdminTable({ instructors }: AdminTableProps) {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState(instructors);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return records;
    return records.filter((instructor) => instructor.name.toLowerCase().includes(term));
  }, [records, search]);

  const updateInstructor = (id: string, field: 'featured' | 'verified', value: boolean) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/instructors/${id}/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, value })
        });
        if (!response.ok) {
          throw new Error('Failed to update instructor');
        }
        setRecords((prev) =>
          prev.map((instructor) =>
            instructor.id === id ? { ...instructor, [field]: value } : instructor
          )
        );
      } catch (error) {
        toast({
          title: 'Update failed',
          description: error instanceof Error ? error.message : 'Please try again later.',
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <Button type="button" variant="secondary" onClick={() => setRecords(instructors)}>
          Reset list
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resort
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Languages
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Featured
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Verified
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filtered.map((instructor) => (
              <tr key={instructor.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{instructor.name}</td>
                <td className="px-4 py-3 text-slate-600">{instructor.resort}</td>
                <td className="px-4 py-3 text-slate-600">{instructor.languages.join(', ')}</td>
                <td className="px-4 py-3">
                  <Toggle
                    pressed={instructor.featured}
                    onPressedChange={(pressed) => updateInstructor(instructor.id, 'featured', pressed)}
                    disabled={isPending}
                  >
                    {instructor.featured ? 'On' : 'Off'}
                  </Toggle>
                </td>
                <td className="px-4 py-3">
                  <Toggle
                    pressed={instructor.verified}
                    onPressedChange={(pressed) => updateInstructor(instructor.id, 'verified', pressed)}
                    disabled={isPending}
                  >
                    {instructor.verified ? 'On' : 'Off'}
                  </Toggle>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
