(()=>{var t={285:()=>{class t extends HTMLElement{constructor(){super(),this.link=document.createElement("link"),this.link.setAttribute("rel","shortcut icon"),this.image=document.createElement("img"),this.image.onload=()=>this.updateIcon(),this.badgeBackgroundImage=document.createElement("img"),this.badgeBackgroundImage.onload=()=>this.updateIcon(),this.canvas=document.createElement("canvas"),this.canvas.width=t.favIconSize,this.canvas.height=t.favIconSize,document.head.appendChild(this.link),this.updateSrc(),this.updateBadgeBackgroundSrc()}static get observedAttributes(){return["src","badge","badgeBackgroundSrc","badgeColor","textColor","badgeSize"]}get src(){return this.getAttribute("src")}set src(t){this.setAttribute("src",t)}get badgeBackgroundSrc(){return this.getAttribute("badgeBackgroundSrc")}set badgeBackgroundSrc(t){this.setAttribute("badgeBackgroundSrc",t)}get badgeSize(){return parseInt(this.getAttribute("badgeSize"))||10}set badgeSize(t){this.setAttribute("badgeSize",t.toString())}get badge(){return this.getAttribute("badge")}set badge(t){this.setAttribute("badge",t)}get badgeColor(){return this.getAttribute("badgeColor")||"red"}set badgeColor(t){this.setAttribute("badgeColor",t)}get textColor(){return this.getAttribute("textColor")||"black"}set textColor(t){this.setAttribute("textColor",t)}attributeChangedCallback(t,e,a){switch(t){case"src":this.updateSrc();break;case"badgeBackgroundSrc":this.updateBadgeBackgroundSrc();break;case"badge":case"badgeColor":case"textColor":this.updateIcon()}}updateSrc(){this.image.src=this.src}updateBadgeBackgroundSrc(){this.badgeBackgroundSrc&&(this.badgeBackgroundImage.src=this.badgeBackgroundSrc)}updateIcon(){const e=this.canvas.getContext("2d");e.clearRect(0,0,t.favIconSize,t.favIconSize),e.drawImage(this.image,0,0,t.favIconSize,t.favIconSize);const a=this.badgeSize;var n;(""==(n=this.badge)||0!=n&&"false"!=n)&&(this.badgeBackgroundSrc?e.drawImage(this.badgeBackgroundImage,this.canvas.width-a,this.canvas.height-a,a,a):this.drawBadgeCircle(e,this.badgeColor,a),(t=>0!=t&&"true"!==t)(this.badge)&&(e.textAlign="center",e.textBaseline="middle",e.fillStyle=this.textColor,e.fillText(this.badge.slice(0,2),this.canvas.width-a/2,this.canvas.height-a/2))),this.link.href=this.canvas.toDataURL("image/png")}drawBadgeCircle(t,e,a){const n=.5*a;t.beginPath(),t.arc(this.canvas.width-n,this.canvas.height-n,n,0,2*Math.PI),t.fillStyle=this.badgeColor,t.fill()}}t.favIconSize=16,customElements.define("favicon-badge",t)},300:(t,e)=>{"use strict";e.__esModule=!0;var a=function(){function t(){}return t.has=function(t){return null!==sessionStorage.getItem(t)},t.getByKey=function(e){return!1===t.has(e)?"":sessionStorage.getItem(e)},t.setByKey=function(t,e){sessionStorage.setItem(t,e)},t.resetByKey=function(e){!0===t.has(e)&&sessionStorage.removeItem(e)},t}();e.default=a},680:(t,e)=>{"use strict";e.__esModule=!0,e.waitElementLoaded=void 0,e.waitElementLoaded=function(t){if(void 0!==window.MutationObserver)return new Promise((function(e){if(document.querySelector(t))return e(document.querySelector(t));var a=new MutationObserver((function(){document.querySelector(t)&&(e(document.querySelector(t)),a.disconnect())}));a.observe(document.body,{childList:!0,subtree:!0})}));console.error("請檢查瀏覽器使否支援 MutationObserver")}},156:(t,e)=>{"use strict";e.__esModule=!0,e.insertFaviconHTML=e.updateFavicon=e.getFaviconDom=void 0,e.getFaviconDom=function(t){var e=document.createElement("link");return e.rel="icon",e.href=t,e},e.updateFavicon=function(t){document.getElementsByTagName("head")[0].appendChild((0,e.getFaviconDom)(t))},e.insertFaviconHTML=function(t){document.getElementsByTagName("head")[0].innerHTML+=t}},249:(t,e,a)=>{"use strict";e.__esModule=!0,e.log=void 0;var n=a(488);e.log=function(t){console.log("".concat(n().toLocaleString(),":").concat(t))}},489:(t,e)=>{"use strict";e.__esModule=!0,e.showNotification=void 0,e.showNotification=function(t,e,a){new Notification(t,e).onclose=a}},116:(t,e)=>{"use strict";var a;e.__esModule=!0,function(t){t.SIGN_IN_NOTIFICATION="SIGN_IN_NOTIFICATION",t.OFF_WORK_NOTIFICATION="OFF_WORK_NOTIFICATION",t.SIGN_OUT_NOTIFICATION="SIGN_OUT_NOTIFICATION",t.SIGN_IN_NOTIFICATION_TIMER="SIGN_IN_NOTIFICATION_TIMER",t.TODAY_ATTENDANCE_CONTENT_TIMER="TODAY_ATTENDANCE_CONTENT_TIMER",t.TODAY_ATTENDANCE_FAVICON_TIMER="TODAY_ATTENDANCE_FAVICON_TIMER"}(a||(a={})),e.default=a},247:function(t,e,a){"use strict";var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var e,a=1,n=arguments.length;a<n;a++)for(var i in e=arguments[a])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},n.apply(this,arguments)},i=this&&this.__awaiter||function(t,e,a,n){return new(a||(a=Promise))((function(i,r){function o(t){try{s(n.next(t))}catch(t){r(t)}}function c(t){try{s(n.throw(t))}catch(t){r(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof a?e:new a((function(t){t(e)}))).then(o,c)}s((n=n.apply(t,e||[])).next())}))},r=this&&this.__generator||function(t,e){var a,n,i,r,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return r={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function c(r){return function(c){return function(r){if(a)throw new TypeError("Generator is already executing.");for(;o;)try{if(a=1,n&&(i=2&r[0]?n.return:r[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,r[1])).done)return i;switch(n=0,i&&(r=[2&r[0],i.value]),r[0]){case 0:case 1:i=r;break;case 4:return o.label++,{value:r[1],done:!1};case 5:o.label++,n=r[1],r=[0];continue;case 7:r=o.ops.pop(),o.trys.pop();continue;default:if(!((i=(i=o.trys).length>0&&i[i.length-1])||6!==r[0]&&2!==r[0])){o=0;continue}if(3===r[0]&&(!i||r[1]>i[0]&&r[1]<i[3])){o.label=r[1];break}if(6===r[0]&&o.label<i[1]){o.label=i[1],i=r;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(r);break}i[2]&&o.ops.pop(),o.trys.pop();continue}r=e.call(t,o)}catch(t){r=[6,t],n=0}finally{a=i=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,c])}}};e.__esModule=!0;var o=a(488);a(285);var c=a(249),s=a(156),l=a(489),d=a(680),u=a(300),g=a(147),f=a(116),h=function(t){var e=o(),a=p(t[0]),n=a.signInDate,i=a.signOutDate,r=m(i.clone().subtract(b(t),"minutes")),s=n.format("HH:mm",{trim:!1}),d=r.diff(e,"minutes"),g=n.clone().add(9,"hours").diff(e,"minutes"),F=e.format("YYYYMMDD",{trim:!1});if(""===s){if(u.default.getByKey(f.default.SIGN_IN_NOTIFICATION)===F)return;(0,l.showNotification)("記得簽到",{body:"尚未有簽到的紀錄",icon:"https://cy.iwerp.net/portal/images/chungyo.ico"},(function(){(0,c.log)("已經關閉簽到通知"),u.default.setByKey(f.default.SIGN_IN_NOTIFICATION,F)}))}if(d<0&&g<0){if(u.default.getByKey(f.default.OFF_WORK_NOTIFICATION)===F)return;(0,l.showNotification)("記得簽退",{body:"超時工作(+".concat(Math.abs(g),")"),icon:"https://cy.iwerp.net/portal/images/chungyo.ico"},(function(){(0,c.log)("已經關閉超時工作通知"),u.default.setByKey(f.default.OFF_WORK_NOTIFICATION,F)}))}else if(d<30){if(u.default.getByKey(f.default.SIGN_OUT_NOTIFICATION)===F)return;(0,l.showNotification)("記得簽退",{body:"".concat(d>0?"預計 ".concat(r.fromNow(),"下班"):"符合下班條件"),icon:"https://cy.iwerp.net/portal/images/chungyo.ico"},(function(){(0,c.log)("已經關閉簽退通知"),u.default.setByKey(f.default.SIGN_OUT_NOTIFICATION,F)}))}var B=window.setTimeout((function(){return h(t)}),3e5);u.default.setByKey(f.default.SIGN_IN_NOTIFICATION_TIMER,String(B))},m=function(t){var e=t.format("YYYY/MM/DD",{trim:!1}),a=o("".concat(e," 17:00"));return t.isBefore(a)?a:t},p=function(t){return n(n({},t),{signInDate:(e=t.signInDate,a=e.format("YYYY/MM/DD",{trim:!1}),i=o("".concat(a," 08:00")),e.isBefore(i)?i:e)});var e,a,i},b=function(t){for(var e=0,a=0,n=t;a<n.length;a++){var i=n[a];e+=F(i)}return e},F=function(t){var e=p(t),a=e.signOutDate,n=e.signInDate,i=a.diff(n,"minutes");return 0===i?0:i-540},B=function(t){var e=o(),a=t.innerText.split("\t"),n="".concat(e.year(),"/").concat(a[0].split(" ")[0]);return{signInDate:o("".concat(n," ").concat(a[1])),signOutDate:o("".concat(n," ").concat(a[2]))}},v=function(t,e){var a=p(e[0]),n=a.signOutDate,i=a.signInDate,r=m(n.clone().subtract(b(e),"minutes")),s=r.format("HH:mm",{trim:!1}),l=r.diff(o(),"minutes"),d=i.clone().add(9,"hours").diff(o(),"minutes");t.innerHTML="<h6> ".concat(s," </h6>"),t.innerHTML+=l>0?"<div> 預計 ".concat(r.fromNow()," </div>"):"<div> 符合下班條件 </div>",l<0&&d<0&&(t.innerHTML='<div> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+'.concat(Math.abs(d),")</span></div>"));var g=window.setTimeout((function(){(0,c.log)("更新預設當日下班內容"),v(t,e)}),6e4);u.default.setByKey(f.default.TODAY_ATTENDANCE_CONTENT_TIMER,String(g))},y=function(t,e){var a=e.signInDate.format("HH:mm",{trim:!1});if("00:00"!==e.signOutDate.format("HH:mm",{trim:!1})||"00:00"!==a){var n=F(e);t.innerHTML+=' <span style="letter-spacing:1px; font-weight:bold; color: '.concat(n>=0?"green":"red",'">  (').concat(n>=0?"+".concat(n):n,")</span>")}else t.innerHTML=""},T=function(t,e){var a=p(e[0]),n=a.signOutDate,i=a.signInDate,r=m(n.clone().subtract(b(e),"minutes")),s=r.diff(o(),"minutes"),l=i.clone().add(9,"hours").diff(o(),"minutes"),d=document.querySelector("favicon-badge");d.textColor="white",d.badgeSize=16,s>0?(document.title="預計 ".concat(r.fromNow()),d.badgeColor="#006600",d.badge=r.fromNow().match(/(\d+)\s.+/)[1]+"H"):(document.title="符合下班條件",d.badgeColor="#e69500",d.badge="可"),s<0&&l<0&&(document.title="超時工作(+".concat(Math.abs(l),")"),d.badgeColor="#cc0000",d.badge="超");var g=window.setTimeout((function(){(0,c.log)("更新預設當日下班 Favicon"),T(t,e)}),6e4);u.default.setByKey(f.default.TODAY_ATTENDANCE_FAVICON_TIMER,String(g))},A=function(){(0,d.waitElementLoaded)('tbody[id="formTemplate:attend_rec_datatable_data"]').then((function(t){if(!0!==t.innerText.includes("預計")&&!0!==t.innerText.includes("符合下班條件")&&!0!==t.innerText.includes("超時工作")){window.clearTimeout(Number(u.default.getByKey(f.default.SIGN_IN_NOTIFICATION_TIMER))),window.clearTimeout(Number(u.default.getByKey(f.default.TODAY_ATTENDANCE_CONTENT_TIMER))),window.clearTimeout(Number(u.default.getByKey(f.default.TODAY_ATTENDANCE_FAVICON_TIMER))),(0,c.log)("出缺勤表格已經載入");var e,a,n=t.getElementsByTagName("tr"),i=function(t){for(var e=[],a=0;a<t.length;a++){var n=t[a];if(!0===/\([日|六]\)/.test(n.innerText))break;e.push(B(n))}return e}(n);!function(t,e){for(var a=0;a<e.length;a++){var n=t[a].getElementsByTagName("td").item(2);0===a?v(n,e):y(n,e[a])}}(n,i),T(n,i),h(i),e=t.parentElement.parentElement,(a=document.createElement("div")).innerText="Kenny design © V".concat(g["wrep-version"]),a.style.textAlign="right",a.title=["v2.3.9(20221104) 根據不同剩餘時間來顯示 favicon 樣式和網頁標題","v2.3.8(20221028) 下班提示訊息和畫面一致化","v2.3.7(20221026) 修改彈跳視窗「即將符合下班條件」字眼為「預計 MM 分鐘後」","v2.3.6(20221024) 解決過早上班或是預測過早下班的問題","v2.3.5(20221020) 顯示「符合下班條件」資訊","v2.3.4(20221018) 顯示超時工作的資訊","v2.3.4(20221018) 清空重複執行的出缺勤 timer","v2.3.3(20221014) 更新特休 TOKEN","v2.3.2(20221013) 顯示更新日誌","v2.3.1(20221013) 新增每五分鐘(簽到、簽退、超時工作)通知訊息視窗","v2.3.1(20221013) 通知訊息視窗點擊「關閉」後當天不會再顯示","v2.2.0(20221012) 解決特休狀況失效的問題","v2.2.0(20221012) 顯示版號和版權資訊","v2.2.0(20221012) 忽略國定假日的簽退內容提示文字","v2.1.0(20221006) 解決每次 wrep 更新時畫面為空的問題","v2.0.0(20221003) 顯示特休狀況"].slice(0,5).join("\n"),e.append(a)}})),(0,d.waitElementLoaded)(".waitingTaskMClass").then((function(t){return i(void 0,void 0,void 0,(function(){var e,a;return r(this,(function(n){switch(n.label){case 0:return!0===t.innerText.includes("特休狀況")?[2]:((0,c.log)("待辦事項表格已經載入"),[4,i(void 0,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return[4,fetch("https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml",{headers:{accept:"application/xml, text/xml, */*; q=0.01","accept-language":"zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5","cache-control":"no-cache","content-type":"application/x-www-form-urlencoded; charset=UTF-8","faces-request":"partial/ajax",pragma:"no-cache","sec-ch-ua":'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',"sec-ch-ua-mobile":"?0","sec-ch-ua-platform":'"macOS"',"sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest"},referrer:"https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml",referrerPolicy:"strict-origin-when-cross-origin",body:"javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt163_input=2022%2F10%2F26&j_idt168_input=2022%2F11%2F25&j_idt176_focus=&j_idt176_input=&j_idt180_focus=&j_idt180_input=&j_idt189_focus=&j_idt189_input=0&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt212%3Afilter=&aply-data-tb%3Aj_idt216%3Afilter=&aply-data-tb%3Aj_idt218%3Afilter=&aply-data-tb%3Aj_idt220%3Afilter=&aply-data-tb%3Aj_idt222%3Afilter=&aply-data-tb%3Aj_idt224%3Afilter=&aply-data-tb%3Aj_idt229_focus=&aply-data-tb%3Aj_idt229_input=&aply-data-tb%3Aj_idt233%3Afilter=&aply-data-tb%3Aj_idt236_focus=&aply-data-tb%3Aj_idt236_input=&aply-data-tb%3Aj_idt241_focus=&aply-data-tb%3Aj_idt241_input=&aply-data-tb%3Aj_idt246_focus=&aply-data-tb%3Aj_idt246_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt690%3Adlg-leave-aply-vac-table%3Aj_idt694%3Afilter=&j_idt690%3Adlg-leave-aply-vac-table_selection=&j_idt690%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt747=&j_idt752%3Aj_idt762=&javax.faces.ViewState=kUZcKVFfbMwfKHfz%2BxBoJuoMXgwnM2fXn2JvWUaoWb%2FzqWLJ33TH9c8h%2BATou793ou3nAM1a4UTyOrU3%2F8zkQDBnoXGbwllxQw1%2FOIk97B7dxIhhRcXWYibpqH9hVWv01Bqk5LvXQtMxH7r2OpYs99ach22K2ZXggouVh0P38Ud0D%2BULErd6XXnv0sbdBIEgKWMcuXuxYW3LquhH9P64dgug7ExAjvFTikhNOt54CZlmhi0naZ1N0KVsXGP91H0vol0zXRKKmKmZkJ1dGO75HtRPU9aWOx6oc6Vo%2BX2ZEQh3fHUfBpaGquk3yeOgFPBhdf5OPemsUo9iYg3W9MEIL7Yw%2FEazZ%2BawbAHSEMcDG528R13J2U9kTNLnE96WFAsGkR69tNEzZI3uzoaPyrIOewLXxysGNR0%2B3gWHJLfZbotFCx8S3g11Gvk3NJa4mfMUF9DSKd89GSseYwpvubupzzAC1%2BYthh%2BEFwhrhIpkqXYyLsQnsVYPZdymfKvVTrOOJghBbkfwNahmH0bHHAGlJlAqJRkWh%2FDF9k%2BOmaEXOPj3gfn3SCv7DKnHXLYgoRy%2BmPsT54DaFIoSFSxcd5PQMGcUaa%2F8%2BB75qfjcs1sTE1CldlCSZG4rcGkS7THfylOme9M2RapzwOZAS9198cR3xTtdOUAerOqKam%2BT772c2YlQI09yfybgryOxMOp9A2z6BKLWXS1qLq8LkmaP8Yh6S8Nl9vMHKKjH4lVrByImKaMXhv60H%2BSyEmZQBiBZYSeLTqv4aOq1Oan%2BttVt1YtTFsHfKekcs8mC2%2FKa%2FEXBgJ00tYvfv%2FeLCTr7ZfCXuW4hSRtG8iWjHuSNC8J2%2FoHbHN9vYEqg%2Bxi0Mnd4wP1m4QSfuyLTjZlkZhqXknLj9JHBgRlUYWDy4kTnaOFkOTHlyW5VvCWUZYeY4DHi%2Fn1nP2jU4SKhN%2BOdYin66Ro%2F9gQgE7sG58cfgTaLDxi9EBM2CfBBtRNKFapUjXczcvW%2Fu%2FIkviz%2FuhfEDUcJ8D6A0f3gOYKWASQBw2OAsYzIKd9aFf%2FgFYo5Rm8ACa8iWJM6P182GPvhiJCEAmL3I6%2F6SKkldxPcSRNVHFdpSN2Pxa84drVRwOexZQ%2Bo2hFoTnE%2BEqMWmELbjQU0qv%2BmILtRcW4QmLaHnop1WIdbJ%2BbaawQgKXnNbhxsDfKaiWH%2ByOlCGf3jN2AXKBNBwRXvi74CXso5FTy1dZse8uVK%2BsKsqD1VKQ4k%2FYLdS13N4I3q3DXI5eFVPL4p3o%2FrDckDb7bG7HhzqCDphD9xRetbafkQDn6v4%2FxNr5yf11U2Bz1OR%2FMTlHMGsD0gabemPmg3iz1uS0Rkl0KZZG7%2BFoyZrczpyT3aLIlc4hL5OOItewi%2BAtpvhjOVUtXb871kVYQhF%2BOXQKW5nrb4Soj7nyU0tEmzg5J8adOtNN%2BmoSbiAlRMK6tmhKJrawcyfS7%2Bh2ePcQddJ8mDWH1Rdlq%2B9bdHiSl9pi9vRG6OJNdX1uwTju8jdV5dEs87zwaoxoQVVjYD8vEjMq0%2B5LWbZw2vZq6qOYXP92u7%2FetLJh%2FbDm0ggS2Qr%2FA1RqICxOQB3o3fWpz%2BeEgavShtqYazpcLM%2BEyWee8h1h8O8kCNiYDPI9lmxMW4rZH65AdCFMWS8X9iWAVsBvbn0AgNid2Hly8%2Fo%2BLnaw5iaOjT63Cbqvl%2FqSysw1hvuOnABKB%2FQ67H%2FsP5JF6T6wOSg32B37D3zbhAVANxT8vltuDWngGsqXVFWnHhbQPYXCReD%2BBb3iQhizTen3Z2ZrqeHwLBPnfFUdp3Wp1TnoxKutSTqKGwf07QQyb8fBsxgPL1wOPmAUPJ0nFrt5ymxQXY6hmEBVYG6OvRV9aGpca6UL33R9B6hqFQYK48M%2FRQ4ulIEKpfHahGlUOnIJbC9WVyIoYctVDdSysrUL7ErU%2F8TEH%2FYQ0l5AqO0kFSD8kJ%2FC4dUVt05Uuo38C0TR6RWGVj%2BIF%2F%2F1FmBl12OEb3WPX0bt3dhpEjkrCx3yyiUn6D%2BePoYSdc1Viw%2Fg%2BINuZn0YIsDlcikNx748nxvbLCJzYsAg68KI8UftQnIHWlPprBNkmwzsiC5UIIlEKeGXVMZRKjqy791MFPuA1%2Bg1w9MoAxYprb1%2BW08pgKbaZaXsKNsP%2FTvNMNtnYCcHGLECVEt3GXG5wwmKT16a%2FDlfnmjyOieTRZ4J%2FddQ7HPhzinPGFwX55lKoORghUBpUKTEvadsUmlJy9yLmPNvASHENw6RVFMMT%2F1FbQGOPXcPs6wOLs%2FbsStNKuPQlDibIwCZZtvWtvnCuSbj7vtc8%2F1iaoyXyLGihyZKetuezBfmR6faVrvs2ulXZUPp4Ih3raEgXbUAnqEgVJn4BtOOqztNt1KqNcsMJOgGVP7Recg08ouoUqLhydmqQPBPUSF6NWkIk08GLZHmMnPvqVj7MnTNwowB8%2F%2Bz0ONs9io7AsbmnmMLyet2WPUesuJ0I8NKLPCLyet70bM1G69RBqi6VGcfRVkBFPJkmAo%2F00UqpE3s26NfpzOdhk3T20o3eLAWjt%2FRcKRvpJA0Gfff1ycWQzyKk2vOZicwPMCkOepdXzooDbsytFA047F%2FHNZgzvbhyCaTptyRW9dlqrqN5e%2BAE%2B8YyT6OVqctAa0KuhwUBup8Z1HNxL2fK71lyWkbAY2qWfDccWVEtLIkTz5sc1nUoltMDPo6jmBSZqRQcqCAy5R3KiYFQRxMu44kpzWbWfqSJ9xh7r%2FmqOA7AHnbC%2F%2B53v%2Fao2JhTHvUhi26NDl28Z7GmqsngSOgqgytZ0GtzngdYNKO9X6SjIE5X6HFjnBrTp5tPDHtNJRH%2FBkuCgzu%2FN96yK8t06z0jGtVgJhNUt8wzHyP69JlRbpFusA%2BIdRgO8pt0TbBHKmFE%2FNROU4JMsySvmH4x3MT4C0FyBY2wj5wmskujtZlePanbEiJFCSlUnOJzTLHiTd1HcwzeHgsrUO9bcmtb4Qeo5TE2ERtuAly2rPUbS%2Fx9reUbjcleCaVPQ97aOYs94iGqCx9qmGTqa4u5izFu8Qqp6HokkRQqJQOdysD05%2B4u9bPG8pZerLs8YewQruYhGa2DS5f%2BgcZD6XO7brtX%2FyESK%2BBoho3jNM39FVE9bgnyuzJcUnH%2F39eJ3zeWPdy8ULzKXMBaDY6StrLbnZPcbJM8rUY9hfrUU3uq8im6qCYFIrGA6hsgX3%2BxJLGbKeUz0md44lr7eNfz4H1Frw3paMOAMoqxE278K8R0UkZOt%2Fjtsim0XzzUEaed8RuHN8nIj76hkK411fsKGeVnNQHCzzGUlUyPZm8XhCN6libbnEUwkujrZ1TQGFyRibX7XK04aEKxqvT2V0EyjuZlotHWturdtY1mSwlEqN9uq0oabHeFXRIHrwToMbQKt4tRRym40yTn1AAo6Dp44lcdUC48vkkWtxqthG5wUOmDEErPzpQGy%2FG%2BjE1y30%2BQp6a%2BwgCP6X30VJkJpntAzQALvB0Zjj3BkvBPlyCq7d28gQOn4kIYwhbhtdEGXZmAgHVEVbk0Wzoqd%2FMmKnp0A12xyGqfA3cl83ciyAWvztYSyE0AyqmH9ZmgmNttjhYqqLhPL8QamzNmYVuWmZF1B9AozU6rdQRtHkeAjNKEaUCe7E37ONCH9a6qrr1DmisPDtLdDY9H3Kh%2F4A96%2Fgto%2BcY5As8dH7SlpzYokKzEJ26ykl4bhqeQbQLW%2FETuBWn7ECzFzQtpZBsmjdVCj8kLWOuyN8BGXEHE3BicvFCem7QUINEKPEfW99U6p9etPnybx1x0PtbEUSZNCGSApQTg9j91R08xdh8oH6yav0EpJ4gfn%2FucIVLp8Tz5z%2FdWIA9tuaVTdnwBbbh2SbyMeBrwiCdKMV9sYLQ9gl4LK8gHGvZqlxujK0WV1l6rYM2ySHacE5a3MiO1%2FQ8d0TmG6bQfkx%2FPoQrlK83S9zUDOBYOp%2B9SC%2FieT8nifbiOJotLI6wWpXxbPV0tkUbW%2BhCNGniOHesi%2F5ufmGWY3anf5kCaEk8BjH1pBl3aw%2FFZyteOX3dwOLQanVzmDxzjjG0UpVwxXWE0SYetgBY9qS1oUCgr1fU%2FBAmBrvp50AL7u2Xq6Vpypi%2Bp91C%2B9bRjVktxg%2B%2FjsJ95qdWXwXHp7mUyjWD8tmSHPiAGe6nIWKrVWs4NLSLX01qPHkNg85pUkpE14qAmDmG5Du6Mzn0AzAcmFz2bMZ4IEMJ86fWHhcITnCqB8QcK2Vj4GO9GcEue0WalZHYn8SlyyPxPwx5EHaPj985QFLH01G%2Fih6%2B3UiSX%2F38mvKkMqhvSpDJU1OFVODqJV6cJf1OzhOM9rzpHa4WSjzEgmEICuIb07ypdSGMAhKt%2Bor2%2FIcxCSdZPdetp8QLZbLZfXguoFmiYi3tK4kI4kuwW4j9NAGNijHVZ2iphDYHMka5D3MQtKyuniPPBD0bogJZ86L66dUHsiEPc44%2BDZVByoA%2B%2BAO507PUwVB20eF0MBe2Kx7XooBCuzvDgaf0b32ZTqAdDY2pSyF736kWcCzXviTgcz8h3kJyp4L5nKYXAxgHV6frdBRTpEyLpZN6TolvGyhbt9ydjpiiLIO6GdQ%2FZ7G8RDdC4yxhvTqqCyLfgDABV4WGtky7Le2Nwdg93rInBzqguxDRd7wV%2BogSHjOlK%2BMiE1K%2FlRpCDhrUQXYP%2FPDMIIr2FCqLnHZfaeoG60D1i4Hz23JTe2Wc0Olqtel4uGNilEY%2Fx%2Bo4%2BYLxjCkM9TK%2FVwjQdFXfRICByVOR4sU%2Bd%2FlwGXRhHx1Zy%2FGRw7hwjPPcUypBlMsHC5Eh7FBg75qWSNEjv2RLHzq%2BEoiHFBEZdjyYsXi6ZlEzV1FSjmydjCViPxvKCCNXkAERli6JUvukfvBNxfIjvbUGDyXb7jCwU%2B9JDBpXQa3WsAW2dgbNhAojRNlluGvCiMvApsyjZzZ7AHJ8tZCdVj1GJTghQMZpqmByUDgfO8RCbfVG0yH1qqg8nQxws1YwPpMuWwH37up8odJCovmAM6Rzy16ADfjSkRrufwgtJn%2BxeOfksVdgR2MDLU%2Fwv96Fx%2FzRt9wMQ%2Fkb2EGV3nDM0xBxKcdQpjSzTPLGuLk3AqYa6ERAbmCPWPuTI2zg4iUHYLHoS0HWk1Of44CEhWe%2BSE8rOx3jNc7XmB%2FtMaq1ivph4d75lj4k7NPGux%2FrY4wYv5l5ngouF1fHNCwG86ICetm2G192A7etfJAC5jVc%2BKcTpQ9hCU1jxfTQVSDsObuOYXdpFfaTl9MicPkK0LrHLhVZ9uDqlYu1ZSzCgunzVqD3WlCE49sfcCkzAP2XW4M3H5FyvNIvu7nil1gwPtce7mHTPnRp8tbpiOVonLJcQGLNMrlltgw48NMei6y2KKXITImjYYpm4neluRLHYGR0IjKhuRZFv%2BVrq9XhdNjWX4Nn22GxpSQ7XylFQK8LXJOn%2Fqfj2R%2F9e1j4yo2zLfMA3t6RnTntxsMZuMAmyGcFE4JeWyeiRCjoC9%2FoWJxNSnFX567fWGwd0eIL3JfZt2%2FSQBZX%2F%2FJ0t5iamXM6%2FHuTFORDYljgElbxrnm9F9SvFBppFWWftZkYJaENrd7McNSGmXmUhdwZSdLrmKXTP2j8AXqUmj0qhsib6diufENoJygAogDiGFjww5WaeMw1v%2BUmm7fyZdTEpn8Vy2sO53MRjNoP6DIMrwxZMwHJ%2Fyzr5pj9m9fjQmN2VG8DRI%2F2smziW8AcxdwHA%2BN1fCP%2BhDYMcos7TvHWHz0q2rob%2BEkrZYhDXtUksY93bxqaMp30r7BG4DCgSYdQr5ioGRg%2B%2BP0jLH05Yw7pFIFp5GM8Xz0s4SAer2AuSlredLS%2F9Z9QeKcbs7E7Z579TZ724AGVNitIw4%2F%2BCZkAgU96KsNDL470Yv1RshWEcr7wnM3DJmkxpytAlUOd%2FG%2BN%2BmU9RIG15%2F%2BM0NeFlmXGKgjalapY0GTjdYR4fg86thfcSnmF5ZcoWlRrN%2F9Cn2qjTiQ3beTHvVwsL4lb3Z22vkTgEG651xJncNHvvhNlUlJkU5tj9dF7Ud%2BLXZa3pW6D2A27GAaI57daFXTT0E5A0RMs3C3P3veRAdE1uvZufWCC28k76n50jI%2BiXc1Plc3wh6u8OsnYIVY91bpyDNufd8vQ0CxCl37fj8zCMZOWK0VrAzLati0aoooCVMPvQwTkrpMfjmkkqmNb%2Fbbf%2Fk6r9JhvHSt%2BTriP%2FgPfEK5MstBE0vVW6FgsIZkoucnl2jUCIVsXO%2BqeyKyNMfqf0ROkQCQYtnIDoz23s9aauTWrUtdSj430sz%2BeLLBWjfQ47FAZjlh9XcfPSmQirTSgmHlIJV%2F0jUtNugbVbiEdu1JLNtyTcn%2Bct5dOAmSV2n7%2FRvdaiQJ8p3jiM40wxsqKINuhhqGdtLNEBL%2FXrNKxgf1obVzbTwBNHnxAQR5jXAB0N%2BnTsIdjJSH3dAoXRR0aYtb4gUng031mrnXJXP6RXXh0vVgAVpo789iMxK706TLbOvSgiBtS0gxLALia1%2BEDUxKJk7bhkc0dGihyBoMhu8B44mI2nSiEmZ%2BfjaEuPZhA4XJEFF6hhK3PSI5ajz9R0xjj2xIaoMV15rx2BYGRM9ebBodTXh5wea0%2BQHw3fRTMAI00%2Ff1He8h2CagQXaQ9D4DPcrAPWIQLqWSqghX3jD87wj1bNKaqxyeP82caoCpJ9vHNSlEDgFBm0vqdYg3Jbmv8npxgyNSw8lmo6O2F7B85ymYpf4uFGyORnsngarWjrDucHMeZSCNTjlpGeZyrwtv8zBGV1Ghf62h8OHwZ%2FJYdpxSUvf3W3ZryhVlfNr5Euj%2B7As%2FGJGWp8BcFfnGNKAXfALSKfnnFxHVc7HD3Z5LvrhxG3Hls7L73gdgI5y%2BBeFv5%2FtJgmYmHoGb39qu%2Bqz%2BwMhNSuTW3ccDxmDGB3KbUn%2BWS6x9rYdghIjJfku7JMDii0UEHOhXeS5A9KmwXVszz5%2BjcgPzlu76R3vCrHv%2Fw5kan%2BvGji6%2BXDNIaGyP%2BxnF1XFvPXAFcfyZti4xRXe3UUhn17JIv7narBDnsNL1htmfI1%2FdLTkTof3QFm7dtxYODtkz5Q0dMRqg7xUKswzq1Mn7fypVf3vtZSwYVHJCpqMuAEpy%2FaycS%2BdOZE4MRb8PMtXhycn0b8Xa5qTynxq6N1Abl6RWJas%2FQZ2jRB%2BbthcifXad1lnOJ%2FUhR13AtHD117AeK8sa1ZX2I0MLo%2FWb7GH8X3ZsHP%2FrhGfodkG5jLV%2BABzCUb1O83BxE3%2FZGDnYeiM62NvTdCdu0gmzAAEM6eXWQh5R31dqE8A%2FHJFChj8yQIEZEl0JK2QkxeKKd50pxgtTY9GUc0NoGdAegTQAkAp%2BgG6XgTWL49vpZF2D1F6RScURBnih%2FHg4FBz5nLjQjUdUdBWYTYCU5cGRMvyq3z5reU9QEKeXLIKBoLZ8NFsi4acfSQfq0vTRZrm9EJ5rypcaL%2F%2F%2BQVjY6mE8RePePhuAo%2Fj8yNNfHoYDfZ8pxtRwq01KpmdSSVoysglXdD8zlsUTo3XotkiTgJ2B1DexWVMW95lgJ43qR5SLADkuloU2IeDppf2cJ5e9T4SP93Lte8ZvVM%2BJrbcWVyM9TuwKrPl%2FVdb7L4w6Gqdixsfvtrj2YSjzEsroFh8%2FFBgb3wKdi70j0krqn9hx1aIR5lgh2taDNQWIcY8LO53i3pabym6IQ591feGgb%2FzYcBECxw2t1V0Spw6saYqQMSK%2BwU5y6A%2FGeOBw9Ry8BBAchdNM59Xzj0LieuSMCIfoBj3E0X%2FvFVb0SR%2BURTIF9T3MlUbaLm8Cydlop7zRbHAYgUafRCzgcMDIOhXEkz1HLkjXgnp6dRAAaobMrDgwYKQ5Hbz7zd2TqbGDyNVYCuJgBu4vFCto14QLMRpPp%2FANkZBmDheD3g%2FoJ0XcvOAo6zvnfoe9WmPVDNU%2FUM9N0%2FOTTLMXixqqVid6xBjsY9Cewe9A92iV%2FUDfzdF8IpT2atgAMQMNoJRfFTWYf6q6JYgJGZ7no3YwdsRAhTRqJ4WOs4NBDIppP3pfanAK5FSenDl7gYTuv6QCSwtVrmPc0DGMf%2FactqvHjBAfmheSSOzjnB9nllDchQ1Isf5u9squMbtF1JTo5XmY381GcwGxuITXfmVGZXxurVtUNWEEXz0TY0%2Bg%2BI%2BNhx3C649Ql5fiJUtaon32jsqzUjGs%2F0YV0Nx7X8WIkPeWPeysEJUZfhbn9iRAfrE3g%2FzbgZhmPMfoUl1qrKlEXgAhHY4dnAk%2F4753E%2FhD9A%2FjFtW6oDKvOhjiZ2n21BCiQ%3D%3D",method:"POST",mode:"cors",credentials:"include"}).then((function(t){return t.text()})).then((function(t){var e=document.createElement("html");e.innerHTML=t;var a=e.querySelectorAll("#annual-now-year li label:nth-child(2)");return{totalHours:parseInt(a.item(0).innerText),leaveHours:parseInt(a.item(1).innerText),notLeaveHours:parseInt(a.item(2).innerText),startDatetime:a.item(3).innerText,endDatetime:a.item(4).innerText}}))];case 1:return[2,t.sent()]}}))}))]);case 1:return e=n.sent(),a=function(t){return'\n<div id="formTemplate:j_idt323" class="ui-outputpanel ui-widget">\n  <div class="ui-g-12 waiting-task-g">\n    <div class="title-name ui-g-4 ">特休狀況\n    </div>\n    <div class="ui-g-8 ">\n      <span class="todocss">\n        <ul class="todo-ul-list">\n          <li>\n            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">\n            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>\n            已休(含在途)：'.concat(t.leaveHours,'\n          </li>\n          <li>\n            <img id="formTemplate:j_idt329:2:j_idt332" src="/portal/javax.faces.resource/werp_red.png.xhtml?ln=images" alt="">\n            <label id="formTemplate:j_idt329:2:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>\n            <a href="/hr-attendance/leave/personal/personal-apply.xhtml" target="_blank" class="select-link-red">未休：').concat(t.notLeaveHours,'</a>\n          </li>\n          <li>\n            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">\n            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>\n            有效日：').concat(t.endDatetime,'\n          </li>\n        </ul>\n      </span>\n    </div>    \n  </div>\n</div>\n<table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>\n    ')}(e),t.insertAdjacentHTML("afterbegin",a),[2]}}))}))}))};o.locale("zh-tw"),(0,s.insertFaviconHTML)('<favicon-badge src="" />'),A(),window.setInterval((function(){A()}),5e3)},488:t=>{"use strict";t.exports=moment},147:t=>{"use strict";t.exports=JSON.parse('{"name":"tampermonkeyscripts","version":"1.0.0","wrep-version":"2.3.9","description":"","main":".eslintrc.js","scripts":{"lint":"prettier --write \\"src/**/*.{js,ts}\\"","build-wrep":"webpack --config webpack.wrep.js"},"repository":{"type":"git","url":"git+https://github.com/kenny0960/TampermonkeyScripts.git"},"author":"","license":"ISC","bugs":{"url":"https://github.com/kenny0960/TampermonkeyScripts/issues"},"homepage":"https://github.com/kenny0960/TampermonkeyScripts#readme","devDependencies":{"eslint":"^8.9.0","prettier":"^2.7.1","ts-loader":"^9.4.1","typescript":"^4.8.3","webpack":"^5.74.0","webpack-cli":"^4.10.0"},"dependencies":{"favicon-badge":"^2.0.0"}}')}},e={};!function a(n){var i=e[n];if(void 0!==i)return i.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,a),r.exports}(247)})();