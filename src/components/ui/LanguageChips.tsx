import { Badge } from './badge';

interface LanguageChipsProps {
  languages: string[];
}

export function LanguageChips({ languages }: LanguageChipsProps) {
  if (!languages?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((lang) => (
        <Badge key={lang} variant="secondary">
          {lang}
        </Badge>
      ))}
    </div>
  );
}
