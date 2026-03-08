import { ReleaseArtist } from '@/types';

export const mockReleaseArtists: ReleaseArtist[] = [
    // STATIC NOISE — YUNG VODA (main), DIMFROST (producer), B4SS (producer), GLITCH.CTRL (designer)
    { id: 'ra1', release_id: 'r1', artist_id: 'a1', role: 'main' },
    { id: 'ra2', release_id: 'r1', artist_id: 'a3', role: 'producer' },
    { id: 'ra3', release_id: 'r1', artist_id: 'a8', role: 'producer' },
    { id: 'ra4', release_id: 'r1', artist_id: 'a5', role: 'designer' },

    // SIGNAL — KRISTALL (main), DIMFROST (producer)
    { id: 'ra5', release_id: 'r2', artist_id: 'a2', role: 'main' },
    { id: 'ra6', release_id: 'r2', artist_id: 'a3', role: 'producer' },

    // BLUE HOUR — KRISTALL (main), DIMFROST (producer), GLITCH.CTRL (designer)
    { id: 'ra7', release_id: 'r3', artist_id: 'a2', role: 'main' },
    { id: 'ra8', release_id: 'r3', artist_id: 'a3', role: 'producer' },
    { id: 'ra9', release_id: 'r3', artist_id: 'a5', role: 'designer' },

    // CONCRETE — NØIR (main), B4SS (producer)
    { id: 'ra10', release_id: 'r4', artist_id: 'a4', role: 'main' },
    { id: 'ra11', release_id: 'r4', artist_id: 'a8', role: 'producer' },

    // WAVES — SYRENA (main), DIMFROST (producer)
    { id: 'ra12', release_id: 'r5', artist_id: 'a7', role: 'main' },
    { id: 'ra13', release_id: 'r5', artist_id: 'a3', role: 'producer' },

    // VOID PROTOCOL — YUNG VODA (main), KRISTALL (feat), NØIR (feat), DIMFROST (producer), B4SS (producer), GLITCH.CTRL (designer)
    { id: 'ra14', release_id: 'r6', artist_id: 'a1', role: 'main' },
    { id: 'ra15', release_id: 'r6', artist_id: 'a2', role: 'feat' },
    { id: 'ra16', release_id: 'r6', artist_id: 'a4', role: 'feat' },
    { id: 'ra17', release_id: 'r6', artist_id: 'a3', role: 'producer' },
    { id: 'ra18', release_id: 'r6', artist_id: 'a8', role: 'producer' },
    { id: 'ra19', release_id: 'r6', artist_id: 'a5', role: 'designer' },
];
