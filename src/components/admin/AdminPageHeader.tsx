import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
    actionHref?: string;
    actionLabel?: string;
}

export function AdminPageHeader({
    title,
    description,
    backHref,
    backLabel = 'Back',
    actionHref,
    actionLabel,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
                {backHref ? (
                    <Button asChild variant="ghost" className="mb-1 h-auto px-0 text-slate-600">
                        <Link href={backHref} className="inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span>{backLabel}</span>
                        </Link>
                    </Button>
                ) : null}
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>
                {description ? (
                    <p className="text-sm text-slate-600">{description}</p>
                ) : null}
            </div>
            {actionHref && actionLabel ? (
                <Button asChild>
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            ) : null}
        </div>
    );
}
