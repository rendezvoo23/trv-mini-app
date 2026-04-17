import { ReleaseSort, ReleaseDetailViewModel, ReleaseSummaryViewModel } from '@/domain/view-models';
import {
    getGenreByIdRepository,
    getReleaseByIdRepository,
    getReleaseContributorsByReleaseIdRepository,
    getReleaseGenresByReleaseIdRepository,
    getReleasesRepository,
} from '@/lib/repositories/mockRepository';
import {
    mapReleaseDetail,
    mapReleaseSummary,
    sortReleases,
} from '@/lib/services/viewModelMappers';

async function mapPublishedReleaseSummaries(): Promise<ReleaseSummaryViewModel[]> {
    const releases = await getReleasesRepository();
    const publishedReleases = releases.filter(
        (release) => release.status === 'published'
    );

    return Promise.all(
        publishedReleases.map(async (release) => {
            const contributors = await getReleaseContributorsByReleaseIdRepository(
                release.id
            );
            return mapReleaseSummary(release, contributors);
        })
    );
}

export async function getReleases(
    sort: ReleaseSort = 'newest'
): Promise<ReleaseSummaryViewModel[]> {
    const releases = await mapPublishedReleaseSummaries();
    return sortReleases(releases, sort);
}

export async function getReleaseById(
    id: string
): Promise<ReleaseDetailViewModel | null> {
    const release = await getReleaseByIdRepository(id);
    if (!release || release.status !== 'published') {
        return null;
    }

    const [contributors, genreAssignments] = await Promise.all([
        getReleaseContributorsByReleaseIdRepository(release.id),
        getReleaseGenresByReleaseIdRepository(release.id),
    ]);
    const genres = (
        await Promise.all(
            genreAssignments.map((assignment) =>
                getGenreByIdRepository(assignment.genre_id)
            )
        )
    ).filter((genre): genre is NonNullable<typeof genre> => Boolean(genre));

    return mapReleaseDetail(release, contributors, genres);
}
