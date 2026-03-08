import { mockMerch } from '@/data/mockMerch';
import { mockArtists } from '@/data/mockArtists';
import { MerchItemWithArtist, MerchSort } from '@/types';

function enrichMerch(): MerchItemWithArtist[] {
    return mockMerch
        .map((m) => {
            const artist = mockArtists.find((a) => a.id === m.artist_id);
            if (!artist) return null;
            return { ...m, artist };
        })
        .filter(Boolean) as MerchItemWithArtist[];
}

export async function getMerchItems(
    sort: MerchSort = 'newest'
): Promise<MerchItemWithArtist[]> {
    const items = enrichMerch();

    switch (sort) {
        case 'newest':
            return items.sort(
                (a, b) =>
                    new Date(b.release_date).getTime() -
                    new Date(a.release_date).getTime()
            );
        case 'artist':
            return items.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
        case 'available':
            return items.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
        default:
            return items;
    }
}

export async function getMerchById(
    id: string
): Promise<MerchItemWithArtist | null> {
    const items = enrichMerch();
    return items.find((m) => m.id === id) || null;
}
