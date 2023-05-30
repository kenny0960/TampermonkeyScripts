import UpdateLog from '@/common/interfaces/UpdateLog';

const UPDATE_LOGS: UpdateLog[] = [
    {
        version: '0.0.4',
        date: '20230530 1630',
        messages: ['實作隨意截功能'],
    },
    {
        version: '0.0.3',
        date: '20230518 1630',
        messages: ['實作隨意截傳送當前網址的功能', '實作提示傳送訊息的功能'],
    },
    {
        version: '0.0.2',
        date: '20230502 1530',
        messages: ['驗證 selector 的功能'],
    },
    {
        version: '0.0.1',
        date: '20230421 1600',
        messages: ['實作截圖主畫面功能'],
    },
];

export default UPDATE_LOGS;
