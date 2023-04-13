import { sendMessages } from '@/common/lineBot/ajax';
import { getScreenshotFlexBubble } from '@/common/lineBot/flexMessageTemplate';
import { getCanvasImageUrl } from '@/common/uploader';
import { log } from '@/common/logger';

export const sendCanvasElementScreenshot = async (canvasElement: HTMLCanvasElement | null, title: string): Promise<void> => {
    if (canvasElement === null) {
        log('截圖失敗：元件不存在');
        return;
    }

    const canvasImageUrl: string = await getCanvasImageUrl(canvasElement);

    if (canvasImageUrl === '') {
        log('截圖失敗：上傳圖片網址為空');
        return;
    }

    sendMessages([
        {
            type: 'flex',
            altText: title,
            contents: getScreenshotFlexBubble(canvasImageUrl, title),
        },
    ]);
};
