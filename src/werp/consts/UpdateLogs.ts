import UpdateLog from '@/werp/interfaces/UpdateLog';

const UPDATE_LOGS: UpdateLog[] = [
    {
        version: '3.6.2',
        date: '20221228',
        messages: ['隱藏空的近期請假表格', '解決近期請假日期參數錯誤的問題'],
    },
    {
        version: '3.6.1',
        date: '20221228',
        messages: ['固定顯示請假記錄的單位為小時'],
    },
    {
        version: '3.6.0',
        date: '20221227',
        messages: ['顯示近期請假狀況'],
    },
    {
        version: '3.5.0',
        date: '20221226',
        messages: ['顯示異常、簽核中和請假的個別資訊'],
    },
    {
        version: '3.4.2',
        date: '20221223',
        messages: ['解決更新網頁後簽到退顯示異常的問題', '顯示不同禮拜的簽到退情況'],
    },
    {
        version: '3.4.1',
        date: '20221223',
        messages: ['解決請假記錄顯示錯誤的問題'],
    },
    {
        version: '3.4.0',
        date: '20221223',
        messages: ['自動取得請假和特休狀況的 TOKEN', '已簽退就不再預測可簽退時間', '顯示出缺勤「異常」的記錄'],
    },
    {
        version: '3.3.0',
        date: '20221216',
        messages: ['移除表頭欄位和修改簽到退表格樣式', '根據請假情況來調整計算已上班分鐘數'],
    },
    {
        version: '3.2.1',
        date: '20221212',
        messages: ['解決取得考勤彙總表參數名稱異動的問題'],
    },
    {
        version: '3.2.0',
        date: '20221209',
        messages: ['顯示忘簽到退按鍵'],
    },
    {
        version: '3.1.0',
        date: '20221202',
        messages: ['解決請假導致預計時間錯亂的問題'],
    },
    {
        version: '3.0.0',
        date: '20221202',
        messages: ['顯示請假資訊'],
    },
    {
        version: '2.4.1',
        date: '20221111',
        messages: ['修正 favicon 無限增生的問題'],
    },
    {
        version: '2.4.0',
        date: '20221107',
        messages: ['修正 favicon 失效的問題'],
    },
    {
        version: '2.3.9',
        date: '20221104',
        messages: ['根據不同剩餘時間來顯示 favicon 樣式和網頁標題'],
    },
    {
        version: '2.3.8',
        date: '20221028',
        messages: ['下班提示訊息和畫面一致化'],
    },
    {
        version: '2.3.7',
        date: '20221026',
        messages: ['修改彈跳視窗「即將符合下班條件」字眼為「預計 MM 分鐘後」'],
    },
    {
        version: '2.3.6',
        date: '20221024',
        messages: ['解決過早上班或是預測過早下班的問題'],
    },
    {
        version: '2.3.5',
        date: '20221020',
        messages: ['顯示「符合下班條件」資訊'],
    },
    {
        version: '2.3.4',
        date: '20221018',
        messages: ['顯示超時工作的資訊', '清空重複執行的出缺勤 timer'],
    },
    {
        version: '2.3.2',
        date: '20221013',
        messages: ['顯示更新日誌'],
    },
    {
        version: '2.3.1',
        date: '20221013',
        messages: ['新增每五分鐘(簽到、簽退、超時工作)通知訊息視窗', '通知訊息視窗點擊「關閉」後當天不會再顯示'],
    },
    {
        version: '2.2.0',
        date: '20221012',
        messages: ['解決特休狀況失效的問題', '顯示版號和版權資訊', '忽略國定假日的簽退內容提示文字'],
    },
    {
        version: '2.1.0',
        date: '20221006',
        messages: ['解決每次 wrep 更新時畫面為空的問題'],
    },
    {
        version: '2.0.0',
        date: '20221003',
        messages: ['顯示特休狀況'],
    },
];

export default UPDATE_LOGS;
