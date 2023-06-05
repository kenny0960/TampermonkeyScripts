# 隨意截

### step 1:

安裝 [tampermonkey](https://www.tampermonkey.net/)

### step 2-1:

1. 取得 [LINE USER ID](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/LINE.md)
2. 取得 [LINE_MESSAGING_API_ACCESS_TOKEN](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/LINE.md)
3. 取得 [UPLOAD_JS_TOKEN](https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/doc/UPLOAD_JS.md)

### step 2-2:

點擊 tampermonkey 中的「新增腳本」，並且在「編輯器」分頁中貼上程式碼後存檔

```
// ==UserScript==
// @name        隨意截
// @namespace   http://tampermonkey.net/
// @version     0.0.1
// @description try to take over the world!
// @author      ⓚ design
// @match       https://*/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @require     https://getbootstrap.com/docs/4.0/assets/js/vendor/popper.min.js
// @require     https://getbootstrap.com/docs/4.0/dist/js/bootstrap.min.js
// @require     https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/screenshot.bundle.js
// @icon        https://pbs.twimg.com/profile_images/1305394576602013698/Tvz6UU5R_normal.jpg
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// 設定 LINE USER ID (step 2-1 中取得並且替換下方空字串)
GM_setValue('LINE_USER_ID', '');
// 設定 LINE MESSAGEING API ACCESS TOKEN (step 2-1 中取得並且替換下方空字串)
GM_setValue('LINE_MESSAGING_API_ACCESS_TOKEN', '');
// 設定 UPLOAD JS TOKEN (step 2-1 中取得並且替換下方空字串)
GM_setValue('UPLOAD_JS_TOKEN', '');
```

### step 3:

繼續 step 2，點擊「編輯器」旁邊的「設定」分頁勾選檢查更新

備註：「更新網址」如果為空則貼上 https://raw.githubusercontent.com/kenny0960/TampermonkeyScripts/master/dist/screenshot.bundle.js


### step 4:

點擊最上層的「設定」(跟 step 3 的設定不同！)，找到外部的「更新週期」，選擇「永遠」即可
