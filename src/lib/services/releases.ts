import { mockReleases } from '@/data/mockReleases';
import { mockReleaseArtists } from '@/data/mockReleaseArtists';
import { mockArtists } from '@/data/mockArtists';
import { mockGenres } from '@/data/mockGenres';
import { ReleaseSort, ReleaseWithArtists } from '@/types';

function enrichRelease(releaseId: string): ReleaseWithArtists | null {
    const release = mockReleases.find((r) => r.id === releaseId);
    if (!release) return null;

    const releaseArtistEntries = mockReleaseArtists.filter(
        (ra) => ra.release_id === release.id
    );
    const artists = releaseArtistEntries
        .map((ra) => {
            const artist = mockArtists.find((a) => a.id === ra.artist_id);
            if (!artist) return null;
            return { artist, role: ra.role };
        })
        .filter(Boolean) as ReleaseWithArtists['artists'];

    const genre = mockGenres.find((g) => g.id === release.genre_id) || {
        id: '',
        name: 'Unknown',
    };

    return { ...release, artists, genre };
}

export async function getReleases(
    sort: ReleaseSort = 'newest'
): Promise<ReleaseWithArtists[]> {
    const enriched = mockReleases
        .map((r) => enrichRelease(r.id)!)
        .filter(Boolean);

    return enriched.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

export async function getReleaseById(
    id: string
): Promise<ReleaseWithArtists | null> {
    return enrichRelease(id);
}
