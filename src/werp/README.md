# WERP 統計簽到退時間

### step 1:

安裝 [tampermonkey](https://www.tampermonkey.net/)

### step 2-1:

1. 取得 [LINE USER ID](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/LINE.md)
2. 取得 [LINE_MESSAGING_API_ACCESS_TOKEN](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/LINE.md)
3. 取得 [LINE_NOTIFY_CHANNEL_ACCESS_TOKEN](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/LINE.md)
4. 取得 [UPLOAD_JS_TOKEN](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/UPLOAD_JS.md)

### step 2-2:

點擊 tampermonkey 中的「新增腳本」，並且在「編輯器」分頁中貼上程式碼後存檔


```
// ==UserScript==
// @name         WERP 簽到退時間
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       GTII-Kenny
// @match        https://cy.iwerp.net/portal/page/new_home.xhtml
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js
// @require      https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/werp.bundle.js
// @icon         https://cy.iwerp.net/portal/images/chungyo.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// 調整出缺勤更新頻率
GM_setValue('TIMER_ATTENDANCE_SECONDS', 60);
// 調整通知視窗更新頻率
GM_setValue('TIMER_NOTIFICATION_MINUTES', 5);


// 選填(可不填寫)：設定 LINE USER ID (step 2-1 中取得並且替換下方空字串)
GM_setValue('LINE_USER_ID', '');
// 選填(可不填寫)：設定 LINE MESSAGEING API ACCESS TOKEN (step 2-1 中取得並且替換下方空字串)
GM_setValue('LINE_MESSAGING_API_ACCESS_TOKEN', '');
// 選填(可不填寫)：設定 LINE NOTIFY CHANNEL ACCESS TOKEN (step 2-1 中取得並且替換下方空字串)
GM_setValue('LINE_NOTIFY_CHANNEL_ACCESS_TOKEN', '');
// 選填(可不填寫)：設定 UPLOAD JS TOKEN (step 2-1 中取得並且替換下方空字串)
GM_setValue('UPLOAD_JS_TOKEN', '');
```

![image](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/images/wrep-step2.png)

### step 3:

繼續 step 2-2，點擊「編輯器」旁邊的「設定」分頁勾選檢查更新

備註：「更新網址」如果為空則貼上 https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/werp.bundle.js

![image](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/images/wrep-step3.png)


### step 4:
點擊最上層的「設定」(跟 step 3 的設定不同！)，找到外部的「更新週期」，選擇「永遠」即可

![image](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/images/wrep-step4.png)
