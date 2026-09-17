import { Card, CardContent } from '@/components/ui/card';
import { Building, FileCheck, FileText, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface MetricsCardsProps {
  pendingRegistrations: number;
  pendingDocReviews: number;
  invoicesAwaitingApproval: number;
  approvedPayableAmount: number;
  averageVerificationDays: number;
  overdueInvoices: number;
}

export function MetricsCards({
  pendingRegistrations,
  pendingDocReviews,
  invoicesAwaitingApproval,
  approvedPayableAmount,
  averageVerificationDays,
  overdueInvoices,
}: MetricsCardsProps) {
  const metrics = [
    {
      title: 'Pending Registrations',
      value: pendingRegistrations,
      description: 'Vendor & customer applications',
      icon: Building,
      color: 'text-sky-600 bg-sky-100 dark:bg-sky-950/50',
    },
    {
      title: 'Pending Document Reviews',
      value: pendingDocReviews,
      description: 'Compliance docs in verification queue',
      icon: FileCheck,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50',
    },
    {
      title: 'Invoices Awaiting Approval',
      value: invoicesAwaitingApproval,
      description: 'Active workflow step routing',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/50',
    },
    {
      title: 'Approved Payable Amount',
      value: formatCurrency(approvedPayableAmount),
      description: 'Ready for finance payment batch',
      icon: CreditCard,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50',
    },
    {
      title: 'Avg Verification Time',
      value: `${averageVerificationDays} Days`,
      description: 'Target SLA: <= 2.0 Days',
      icon: Clock,
      color: 'text-teal-600 bg-teal-100 dark:bg-teal-950/50',
    },
    {
      title: 'Overdue Invoices Alert',
      value: overdueInvoices,
      description: 'Past approved due date',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <Card key={i} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{m.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{m.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
