import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  className?: string;
}

export function FeaturedBadge({ className }: StatusBadgeProps) {
  return (
    <Badge className={cn('bg-amber-100 text-amber-900', className)} variant="secondary">
      Featured
    </Badge>
  );
}

export function VerifiedBadge({ className }: StatusBadgeProps) {
  return (
    <Badge className={cn('bg-emerald-100 text-emerald-900', className)} variant="secondary">
      Verified
    </Badge>
  );
}
