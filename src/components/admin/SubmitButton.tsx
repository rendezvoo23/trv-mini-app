'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '@/components/ui/button';

export function SubmitButton({
    children,
    ...props
}: ButtonProps & { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending || props.disabled} {...props}>
            {pending ? 'Saving...' : children}
        </Button>
    );
}
