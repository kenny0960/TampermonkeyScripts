import { Upload, UploadedFile } from 'upload-js';
import { FileLike } from 'upload-js/dist/FileLike';
import { canvasToBlob } from '@/common/convas';
import { UPLOAD_JS_TOKEN } from '@/werp/consts/env';
import { log } from '@/common/logger';

export const getCanvasImageUrl = async (canvasElement: HTMLCanvasElement): Promise<string> => {
    if (UPLOAD_JS_TOKEN === '') {
        log(`請設定 UPLOAD_JS_TOKEN 環境變數`);
        return;
    }
    const uploader = Upload({
        apiKey: UPLOAD_JS_TOKEN,
    });
    const uploadedFile: UploadedFile = await uploader.uploadFile(canvasToBlob(canvasElement) as unknown as FileLike);
    return uploadedFile.fileUrl;
};
