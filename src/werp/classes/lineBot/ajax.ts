import { log } from '@/common/logger';
import { FlexMessage, Message } from '@/werp/types/lineBot';
import {
    HAS_LINE_MESSAGE_API_AUTH,
    LINE_MESSAGING_API_ACCESS_TOKEN,
    LINE_NOTIFY_CHANNEL_ACCESS_TOKEN,
    LINE_USER_ID,
} from '@/werp/consts/env';

export const sendMessages = (messages: Message[]): void => {
    if (HAS_LINE_MESSAGE_API_AUTH === false) {
        log(`請設定 LINE_MESSAGING_API_ACCESS_TOKEN 和 LINE_USER_ID 環境變數`);
        return;
    }

    GM_xmlhttpRequest({
        url: 'https://api.line.me/v2/bot/message/push',
        headers: {
            Authorization: `Bearer ${LINE_MESSAGING_API_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            to: LINE_USER_ID,
            messages: messages,
        }),
        method: 'POST',
        onload: (response): void => {
            if (response.readyState === 4 && response.status === 200) {
                log(`LINE 發送成功：${(messages[0] as FlexMessage).altText}`);
            } else {
                log(`LINE 發送失敗：${response.status}`);
            }
        },
    });
};

export const notify = (message: string): void => {
    if (LINE_NOTIFY_CHANNEL_ACCESS_TOKEN === '') {
        log(`請設定 LINE_NOTIFY_CHANNEL_ACCESS_TOKEN 環境變數`);
        return;
    }

    GM_xmlhttpRequest({
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            Authorization: `Bearer ${LINE_NOTIFY_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: 'message=' + encodeURIComponent(message),
        method: 'POST',
        onload: (response): void => {
            if (response.readyState === 4 && response.status === 200) {
                log(`LINE 通知成功：${message}`);
            } else {
                log(`LINE 通知失敗：${response.status}`);
            }
        },
    });
};
