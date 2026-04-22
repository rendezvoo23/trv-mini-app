import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseStoragePublicUrl } from '@/lib/supabase/media';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { toStorageKeySegment } from '@/lib/admin/validation';

const ALLOWED_BUCKETS = new Set(['artists', 'releases', 'events']);

function sanitizeFileName(fileName: string) {
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName =
        lastDotIndex >= 0 ? fileName.slice(0, lastDotIndex) : fileName;
    const extension = lastDotIndex >= 0 ? fileName.slice(lastDotIndex) : '';

    const safeBaseName = toStorageKeySegment(baseName) || 'upload';
    const safeExtension = extension.replace(/[^.a-zA-Z0-9]/g, '').toLowerCase();

    return `${safeBaseName}${safeExtension}`;
}

export async function POST(request: Request) {
    const user = await getAdminUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket');
    const folderHint = (formData.get('folder_hint') as string | null) ?? '';
    const altText = (formData.get('alt_text') as string | null) ?? '';

    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (typeof bucket !== 'string' || !ALLOWED_BUCKETS.has(bucket)) {
        return NextResponse.json({ error: 'Invalid storage bucket.' }, { status: 400 });
    }

    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createAdminClient()
        : await createServerSupabaseClient();

    const safeFolder = toStorageKeySegment(folderHint) || 'uploads';
    const storagePath = `${safeFolder}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const uploadResult = await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
    });

    if (uploadResult.error) {
        return NextResponse.json(
            { error: uploadResult.error.message },
            { status: 500 }
        );
    }

    const assetInsertResult = await supabase
        .from('media_assets')
        .insert({
            media_kind: 'image',
            storage_bucket: bucket,
            storage_path: storagePath,
            external_url: null,
            mime_type: file.type || null,
            file_size_bytes: file.size,
            width: null,
            height: null,
            alt_text: altText,
            blurhash: null,
        })
        .select('id, storage_bucket, storage_path, external_url, alt_text')
        .single();

    if (assetInsertResult.error) {
        return NextResponse.json(
            { error: assetInsertResult.error.message },
            { status: 500 }
        );
    }

    const asset = assetInsertResult.data;
    const publicUrl =
        asset.external_url ||
        getSupabaseStoragePublicUrl(asset.storage_bucket, asset.storage_path);

    return NextResponse.json({
        asset: {
            id: asset.id,
            url: publicUrl,
            alt: asset.alt_text ?? '',
        },
    });
}
