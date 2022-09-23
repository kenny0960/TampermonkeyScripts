import * as moment from 'moment';

import { updateFavicon } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';

const showSignInNotification = (dates) => {
    const currentDate = moment();
    const signInDate = dates[0][0];
    const signOutDate = dates[0][2];
    const todaySignInContent = signInDate.format('HH:mm', { trim: false });
    const signOutLeftMinutes = signOutDate.diff(currentDate, 'minutes');

    if (todaySignInContent === '') {
        showNotification('記得簽到', {
            body: '尚未有簽到的紀錄',
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, 60 * 1000);
        return;
    }

    if (signOutLeftMinutes < 0) {
        showNotification('記得簽退', {
            body: `超時工作(${signOutDate.fromNow()})`,
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, 5 * 1000);
        return;
    }

    if (signOutLeftMinutes < 30) {
        showNotification('記得簽退', {
            body: `工作即將結束(${signOutDate.fromNow()})`,
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, (60 * 1000 * signOutLeftMinutes) / 30);
        return;
    }

    setTimeout(showSignInNotification, (5 * 60 * 1000 * signOutLeftMinutes) / 30);
};

const getTotalRemainMinutes = (dates) => {
    let remainMinutes = 0;
    for (const date of dates) {
        remainMinutes += getRemainMinutes(date);
    }
    return remainMinutes;
};

const getRemainMinutes = (date) => {
    const diffMinutes = date[2].diff(date[0], 'minutes');
    if (diffMinutes === 0) {
        return 0;
    }
    return diffMinutes - 9 * 60;
};

const getDatesByTr = (tr) => {
    const currentDate = moment();
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings = tr.innerText.split('\t');
    const dateString = `${currentDate.year()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate = moment(`${dateString} ${datetimeStrings[2]}`);
    const predictedSignOutDate = signInDate.clone().add(9, 'hours');
    return [signInDate, predictedSignOutDate, signOutDate];
};

const getSignInSignOutDates = (trs) => {
    const dates = [];

    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        dates.push(getDatesByTr(tr));
    }

    return dates;
};

const updateSignInSignOutContent = (trs, dates) => {
    for (let i = 0; i < dates.length; i++) {
        const tr = trs[i];
        const signOutDate = dates[i][2];
        const remainMinutes = getRemainMinutes(dates[i]);
        const td = tr.getElementsByTagName('td').item(2);
        if (i !== 0) {
            // 顯示超過或不足的分鐘數
            td.innerHTML = signOutDate.format('HH:mm', { trim: false });
            td.innerHTML += ` <span style="letter-spacing:0.8px; font-weight:bold; color: ${
                remainMinutes >= 0 ? 'green' : 'red'
            }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
        } else {
            td.innerHTML = `<h6> ${signOutDate.format('HH:mm', {
                trim: false,
            })} </h6>`;
            td.innerHTML += `<div> ${signOutDate.fromNow()} </div>`;
        }
    }
    setTimeout(() => {
        updateSignInSignOutContent(trs, dates);
    }, 60 * 1000);
};

const handleTableLoaded = (table) => {
    const trs = table.getElementsByTagName('tr');
    const dates = getSignInSignOutDates(trs);
    // 根據剩餘分鐘來更新當日的簽退時間
    dates[0][2] = dates[0][2].clone().subtract(getTotalRemainMinutes(dates), 'minutes');
    updateSignInSignOutContent(trs, dates);
    showSignInNotification(dates);
};

const waitingTableLoaded = (callback) => {
    if (window.MutationObserver) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach((mutation) => {
                if (mutation.type == 'childList') {
                    if ((mutation.target as HTMLDivElement).id === 'formTemplate:attend_rec_panel_content') {
                        waitElementLoaded('formTemplate:attend_rec_datatable_data').then(callback);
                    }
                }
            });
        });
        observer.observe(document.querySelector('body'), {
            childList: true,
            subtree: true,
        });
    }
};

(function () {
    moment.locale('zh-tw');
    updateFavicon('https://cy.iwerp.net/portal/images/chungyo.ico');
    waitingTableLoaded(handleTableLoaded);
})();
