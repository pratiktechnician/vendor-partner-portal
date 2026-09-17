import { CustomerOnboardingWizard } from '@/components/customer/CustomerOnboardingWizard';

export default function RegisterCustomerPage() {
  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      <CustomerOnboardingWizard />
    </div>
  );
}
