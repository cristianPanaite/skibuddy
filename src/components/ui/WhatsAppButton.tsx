'use client';

import Link from 'next/link';
import { Button, type ButtonProps } from './button';

declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, unknown>) => void;
  }
}

interface WhatsAppButtonProps extends ButtonProps {
  phone: string;
  instructorId: string;
  label?: string;
}

export function WhatsAppButton({ phone, instructorId, label = 'Message on WhatsApp', ...props }: WhatsAppButtonProps) {
  const sanitized = phone.replace(/[^0-9]/g, '');
  return (
    <Button
      asChild
      onClick={() => window?.plausible?.('TAP_WHATSAPP', { props: { instructorId } })}
      {...props}
    >
      <Link href={`https://wa.me/${sanitized}`} target="_blank" rel="noopener noreferrer">
        {label}
      </Link>
    </Button>
  );
}
