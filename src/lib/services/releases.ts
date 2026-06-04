import { ReleaseSort, ReleaseDetailViewModel, ReleaseSummaryViewModel } from '@/domain/view-models';
import {
    getPublishedReleaseRowById,
    getPublishedReleaseRows,
} from '@/lib/repositories/supabaseReadRepository';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
    mapReleaseRowToDetail,
    mapReleaseRowToSummary,
} from '@/lib/supabase/mappers';
import { createPublicServerClient } from '@/lib/supabase/publicServer';
import { sortReleases } from '@/lib/services/viewModelMappers';

export async function getReleases(
    sort: ReleaseSort = 'newest'
): Promise<ReleaseSummaryViewModel[]> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for releases.');
    }

    const supabase = createPublicServerClient();
    const releaseRows = await getPublishedReleaseRows(supabase);
    const releases = releaseRows.map((release) =>
        mapReleaseRowToSummary(supabase, release)
    );

    return sortReleases(releases, sort);
}

export async function getReleaseById(
    id: string
): Promise<ReleaseDetailViewModel | null> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for releases.');
    }

    const supabase = createPublicServerClient();
    const release = await getPublishedReleaseRowById(supabase, id);
    if (!release) {
        return null;
    }

    return mapReleaseRowToDetail(supabase, release);
}
