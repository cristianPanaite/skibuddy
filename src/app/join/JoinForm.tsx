'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';

interface JoinFormProps {
  instructor?: {
    name: string;
    photoUrl?: string | null;
    languages: string[];
    pricePerHourCents: number;
    whatsapp?: string | null;
    instagram?: string | null;
    bio?: string | null;
    resortId: string;
    tags: string[];
  } | null;
  resorts: { id: string; name: string }[];
  tags: { id: string; label: string }[];
  languageOptions: string[];
}

export function JoinForm({ instructor, resorts, tags, languageOptions }: JoinFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    instructor?.languages ?? []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(instructor?.tags ?? []);
  const [selectedResort, setSelectedResort] = useState<string>(
    instructor?.resortId ?? resorts[0]?.id ?? ''
  );

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((item) => item !== language) : [...prev, language]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const payload = {
          name: formData.get('name'),
          photoUrl: formData.get('photoUrl') || null,
          languages: selectedLanguages,
          pricePerHour: Number(formData.get('pricePerHour')),
          whatsapp: formData.get('whatsapp') || null,
          instagram: formData.get('instagram') || null,
          bio: formData.get('bio') || null,
          resortId: selectedResort,
          tags: selectedTags
        };

        const response = await fetch('/api/instructors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save instructor');
        }

        toast({ title: 'Profile saved', description: 'Your instructor profile is live!' });
        router.refresh();
      } catch (error) {
        toast({
          title: 'Could not save profile',
          description: error instanceof Error ? error.message : 'Please try again later.',
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={instructor?.name ?? ''} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            name="photoUrl"
            placeholder="https://..."
            defaultValue={instructor?.photoUrl ?? ''}
          />
        </div>
        <div className="grid gap-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((language) => (
              <Toggle
                key={language}
                pressed={selectedLanguages.includes(language)}
                onPressedChange={() => toggleLanguage(language)}
                type="button"
              >
                {language}
              </Toggle>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pricePerHour">Price per hour (EUR)</Label>
          <Input
            id="pricePerHour"
            name="pricePerHour"
            type="number"
            min={0}
            required
            defaultValue={instructor ? instructor.pricePerHourCents / 100 : ''}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="resort">Resort</Label>
          <Select value={selectedResort} onValueChange={setSelectedResort}>
            <SelectTrigger>
              <SelectValue placeholder="Select resort" />
            </SelectTrigger>
            <SelectContent>
              {resorts.map((resort) => (
                <SelectItem key={resort.id} value={resort.id}>
                  {resort.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            placeholder="40712345678"
            defaultValue={instructor?.whatsapp ?? ''}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            placeholder="@yourhandle"
            defaultValue={instructor?.instagram ?? ''}
          />
        </div>
      </section>
      <section className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={5}
          placeholder="Tell skiers what makes lessons with you unique."
          defaultValue={instructor?.bio ?? ''}
        />
      </section>
      <section className="grid gap-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Toggle
              key={tag.label}
              pressed={selectedTags.includes(tag.label)}
              onPressedChange={() => toggleTag(tag.label)}
              type="button"
            >
              {tag.label}
            </Toggle>
          ))}
        </div>
      </section>
      <Button type="submit" disabled={isPending || !selectedResort || !selectedLanguages.length}>
        {isPending ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  );
}
