// LINE MESSAGING API
export const LINE_USER_ID: string = GM_getValue('LINE_USER_ID', '');
export const LINE_MESSAGING_API_ACCESS_TOKEN: string = GM_getValue('LINE_MESSAGING_API_ACCESS_TOKEN', '');
export const HAS_LINE_MESSAGE_API_AUTH: boolean = LINE_USER_ID !== '' && LINE_MESSAGING_API_ACCESS_TOKEN !== '';

// LINE NOTIFY
export const LINE_NOTIFY_CHANNEL_ACCESS_TOKEN: string = GM_getValue('LINE_NOTIFY_CHANNEL_ACCESS_TOKEN', '');

/*
 * UPLOAD JS
 * https://github.com/upload-io/upload-js
 */
export const UPLOAD_JS_TOKEN: string = GM_getValue('UPLOAD_JS_TOKEN', '');
