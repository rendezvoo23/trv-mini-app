'use client';

import { useFormState } from 'react-dom';
import { loginAdminAction, createEmptyAdminActionState } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
    const [state, formAction] = useFormState(
        loginAdminAction,
        createEmptyAdminActionState()
    );
    const formState = state ?? createEmptyAdminActionState();

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900" htmlFor="email">
                    Email
                </label>
                <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium text-slate-900"
                    htmlFor="password"
                >
                    Password
                </label>
                <Input id="password" name="password" type="password" required />
            </div>
            {formState.message ? (
                <p className="text-sm text-red-600">{formState.message}</p>
            ) : null}
            <Button type="submit" className="w-full">
                Sign in
            </Button>
        </form>
    );
}
