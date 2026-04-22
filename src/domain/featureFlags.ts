export const PUBLIC_SECTION_VISIBILITY = {
    releases: true,
    artists: true,
    merch: false,
    events: true,
} as const;

export function isPublicSectionEnabled(
    section: keyof typeof PUBLIC_SECTION_VISIBILITY
) {
    return PUBLIC_SECTION_VISIBILITY[section];
}
