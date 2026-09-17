import { ENTITY_STATUS_CONFIG, DOCUMENT_STATUS_CONFIG, INVOICE_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/constants/statuses';
import { cn } from '@/components/ui/button';

interface StatusBadgeProps {
  status: string;
  type?: 'entity' | 'document' | 'invoice' | 'payment';
}

export function StatusBadge({ status, type = 'entity' }: StatusBadgeProps) {
  let config = { label: status, variant: 'bg-slate-100 text-slate-700 border-slate-300' };

  if (type === 'entity' && ENTITY_STATUS_CONFIG[status as keyof typeof ENTITY_STATUS_CONFIG]) {
    config = ENTITY_STATUS_CONFIG[status as keyof typeof ENTITY_STATUS_CONFIG];
  } else if (type === 'document' && DOCUMENT_STATUS_CONFIG[status as keyof typeof DOCUMENT_STATUS_CONFIG]) {
    config = DOCUMENT_STATUS_CONFIG[status as keyof typeof DOCUMENT_STATUS_CONFIG];
  } else if (type === 'invoice' && INVOICE_STATUS_CONFIG[status as keyof typeof INVOICE_STATUS_CONFIG]) {
    config = INVOICE_STATUS_CONFIG[status as keyof typeof INVOICE_STATUS_CONFIG];
  } else if (type === 'payment' && PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG]) {
    config = PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG];
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', config.variant)}>
      {config.label}
    </span>
  );
}
