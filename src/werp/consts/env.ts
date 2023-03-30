export const TIMER_ATTENDANCE_SECONDS: number = GM_getValue('TIMER_ATTENDANCE_SECONDS', 60);
export const TIMER_NOTIFICATION_MINUTES: number = GM_getValue('TIMER_NOTIFICATION_MINUTES', 5);

export const LINE_USER_ID: string = GM_getValue('LINE_USER_ID', '');
export const LINE_MESSAGING_API_ACCESS_TOKEN: string = GM_getValue('LINE_MESSAGING_API_ACCESS_TOKEN', '');
export const LINE_NOTIFY_CHANNEL_ACCESS_TOKEN: string = GM_getValue('LINE_NOTIFY_CHANNEL_ACCESS_TOKEN', '');

export const HAS_LINE_MESSAGE_API_AUTH: boolean = LINE_USER_ID !== '' && LINE_MESSAGING_API_ACCESS_TOKEN !== '';

export const UPLOAD_JS_TOKEN: string = GM_getValue('UPLOAD_JS_TOKEN', '');
