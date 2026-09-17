import { Sidebar } from '@/components/shared/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-x-hidden">{children}</div>
    </div>
  );
}
