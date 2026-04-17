import { MerchDetailViewModel, MerchSort, MerchSummaryViewModel } from '@/domain/view-models';
import {
    getMerchItemByIdRepository,
    getMerchItemsRepository,
} from '@/lib/repositories/mockRepository';
import {
    mapMerchDetail,
    mapMerchSummary,
    sortMerchItems,
} from '@/lib/services/viewModelMappers';

export async function getMerchItems(
    sort: MerchSort = 'newest'
): Promise<MerchSummaryViewModel[]> {
    const items = (await getMerchItemsRepository()).filter(
        (item) => item.status === 'published'
    );
    const viewModels = await Promise.all(items.map(mapMerchSummary));
    return sortMerchItems(viewModels, sort);
}

export async function getMerchById(
    id: string
): Promise<MerchDetailViewModel | null> {
    const item = await getMerchItemByIdRepository(id);
    if (!item || item.status !== 'published') {
        return null;
    }

    return mapMerchDetail(item);
}
