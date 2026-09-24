import type { Metadata } from 'next';
import AdminShell from './AdminShell';
import { AdminInstallPrompt } from '@/components/ui/AdminInstallPrompt';

export const metadata: Metadata = {
  title: {
    absolute: 'Ellext Admin Portal',
    template: '%s | Ellext Admin'
  },
  applicationName: 'Ellext Admin',
  manifest: '/manifest-admin.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ellext Admin'
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>
    <AdminInstallPrompt />
    <AdminShell>{children}</AdminShell>
  </>;
}
