# WERP 統計簽到退時間

### step 1:

安裝 [tampermonkey](https://www.tampermonkey.net/)

### step 2:

「新增腳本」並且在「編輯器」分頁中貼上程式碼後存檔

```
// ==UserScript==
// @name         WERP 簽到退時間
// @namespace    http://tampermonkey.net/
// @version      0
// @description  try to take over the world!
// @author       Kenny
// @match        https://cy.iwerp.net/portal/page/new_home.xhtml
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @icon         https://cy.iwerp.net/portal/images/chungyo.ico
// @require      https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/werp.bundle.js
// @grant        none
// ==/UserScript==
```

### step 3:

繼續 step 2，點擊「編輯器」旁邊的「設定」分頁勾選檢查更新

備註：「更新網址」如果為空則貼上 https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/werp.bundle.js


### step 4:
點擊最上層的「設定」(跟 step 3 的設定不同！)，找到外部的「更新週期」，選擇「永遠」即可
