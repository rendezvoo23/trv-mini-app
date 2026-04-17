export function appendPromoCodeToUrl(baseUrl: string, promoCode: string) {
    const trimmedCode = promoCode.trim();
    if (!trimmedCode) {
        return baseUrl;
    }

    const url = new URL(baseUrl);
    url.searchParams.set('promo', trimmedCode);
    return url.toString();
}
