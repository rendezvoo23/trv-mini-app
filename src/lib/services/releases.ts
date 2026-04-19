import { ReleaseSort, ReleaseDetailViewModel, ReleaseSummaryViewModel } from '@/domain/view-models';
import {
    getPublishedReleaseRowById,
    getPublishedReleaseRows,
} from '@/lib/repositories/supabaseReadRepository';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
    mapReleaseRowToDetail,
    mapReleaseRowToSummary,
} from '@/lib/supabase/mappers';
import { sortReleases } from '@/lib/services/viewModelMappers';

export async function getReleases(
    sort: ReleaseSort = 'newest'
): Promise<ReleaseSummaryViewModel[]> {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured for releases.');
    }

    const supabase = createClient();
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

    const supabase = createClient();
    const release = await getPublishedReleaseRowById(supabase, id);
    if (!release) {
        return null;
    }

    return mapReleaseRowToDetail(supabase, release);
}
