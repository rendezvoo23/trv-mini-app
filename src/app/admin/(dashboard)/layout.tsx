import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { logoutAdminAction } from '@/lib/admin/actions';
import { requireAdminUser } from '@/lib/admin/auth';

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAdminUser();

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                            TRV Admin
                        </p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <AdminNav />
                        <form action={logoutAdminAction}>
                            <Button type="submit" variant="outline">
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
        </div>
    );
}
