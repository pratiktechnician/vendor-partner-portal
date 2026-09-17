'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileCheck2,
  Building,
  Users,
  FileText,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  BarChart3,
  Sliders,
  History,
  FolderOpen,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const isVendor = pathname.startsWith('/vendor');
  const isCustomer = pathname.startsWith('/customer');

  const adminLinks = [
    { label: 'Executive Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pending Registrations', href: '/admin/registrations', icon: Building },
    { label: 'Document Reviews Queue', href: '/admin/document-reviews', icon: FileCheck2 },
    { label: 'Active Vendors', href: '/admin/vendors', icon: Users },
    { label: 'Customers Master', href: '/admin/customers', icon: Users },
    { label: 'Invoices Register', href: '/admin/invoices', icon: FileText },
    { label: 'Approval Queue', href: '/admin/approvals', icon: CheckCircle2 },
    { label: 'Payments & Advice', href: '/admin/payments', icon: CreditCard },
    { label: 'Support Tickets', href: '/admin/tickets', icon: MessageSquare },
    { label: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { label: 'Approval Workflows', href: '/admin/workflows', icon: Sliders },
    { label: 'Audit Trail Logs', href: '/admin/audit-logs', icon: History },
  ];

  const vendorLinks = [
    { label: 'Vendor Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', href: '/vendor/profile', icon: Building },
    { label: 'Compliance Documents', href: '/vendor/documents', icon: FolderOpen },
    { label: 'My Invoices', href: '/vendor/invoices', icon: FileText },
    { label: 'Submit New Invoice', href: '/vendor/invoices/new', icon: PlusCircle },
    { label: 'Payment Status', href: '/vendor/payments', icon: CreditCard },
    { label: 'Query Tickets', href: '/vendor/tickets', icon: MessageSquare },
  ];

  const customerLinks = [
    { label: 'Customer Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Organization Profile', href: '/customer/profile', icon: Building },
    { label: 'Agreements & Docs', href: '/customer/documents', icon: FolderOpen },
    { label: 'Support & Queries', href: '/customer/tickets', icon: HelpCircle },
  ];

  const navItems = isVendor ? vendorLinks : isCustomer ? customerLinks : adminLinks;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          {isVendor ? 'Vendor Portal' : isCustomer ? 'Customer Portal' : 'Management Console'}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 font-semibold border-l-4 border-sky-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
