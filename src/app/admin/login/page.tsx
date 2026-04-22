import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { getAdminUser } from '@/lib/admin/auth';

export default async function AdminLoginPage() {
    const user = await getAdminUser();
    if (user) {
        redirect('/admin');
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8 space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                        TRV Admin
                    </p>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Sign in to manage content
                    </h1>
                    <p className="text-sm text-slate-600">
                        Internal access for the TRV team only.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
