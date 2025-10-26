import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, pressed, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    pressed={pressed}
    className={cn(
      'inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-900 data-[state=on]:border-brand-600 data-[state=on]:bg-brand-600 data-[state=on]:text-white',
      className
    )}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
