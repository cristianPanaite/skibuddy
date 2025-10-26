'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select';

interface FiltersProps {
  resorts: { id: string; name: string; slug: string }[];
  availableLanguages: string[];
}

export function Filters({ resorts, availableLanguages }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [resortValue, setResortValue] = useState(searchParams.get('resort') ?? '');
  const [maxPriceValue, setMaxPriceValue] = useState(searchParams.get('maxPrice') ?? '');
  const [languageValue, setLanguageValue] = useState(searchParams.get('language') ?? '');
  const [queryValue, setQueryValue] = useState(searchParams.get('q') ?? '');

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (resortValue) params.set('resort', resortValue);
    if (maxPriceValue) params.set('maxPrice', maxPriceValue);
    if (languageValue) params.set('language', languageValue);
    if (queryValue) params.set('q', queryValue);
    return params.toString();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      const query = buildQueryString();
      router.push(query ? `/instructors?${query}` : '/instructors');
    });
  };

  const resetFilters = () => {
    setResortValue('');
    setMaxPriceValue('');
    setLanguageValue('');
    setQueryValue('');
    startTransition(() => {
      router.push('/instructors');
    });
  };

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="q">Search</Label>
        <Input
          id="q"
          name="q"
          placeholder="Search by name"
          value={queryValue}
          onChange={(event) => setQueryValue(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Resort</Label>
        <Select value={resortValue} onValueChange={setResortValue}>
          <SelectTrigger>
            <SelectValue placeholder="All resorts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All resorts</SelectItem>
            {resorts.map((resort) => (
              <SelectItem key={resort.id} value={resort.slug}>
                {resort.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="maxPrice">Max price (EUR/hour)</Label>
        <Input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min={0}
          value={maxPriceValue}
          onChange={(event) => setMaxPriceValue(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Language</Label>
        <Select value={languageValue} onValueChange={setLanguageValue}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          Apply filters
        </Button>
        <Button type="button" variant="ghost" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </form>
  );
}
