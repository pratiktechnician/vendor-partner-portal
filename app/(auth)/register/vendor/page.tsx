import { VendorRegistrationWizard } from '@/components/vendor/VendorRegistrationWizard';

export default function RegisterVendorPage() {
  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      <VendorRegistrationWizard />
    </div>
  );
}
