import * as moment from 'moment';

import { updateFavicon } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import { Moment } from '@/moment';

interface Dates {
    signInDate: Moment;
    signOutDate: Moment;
    predictedSignOutDate: Moment;
}

const showSignInNotification = (dates: Dates[]) => {
    const currentDate: Moment = moment();
    const { signInDate, signOutDate }: Dates = dates[0];
    const todaySignInContent: string = signInDate.format('HH:mm', { trim: false });
    const signOutLeftMinutes: number = signOutDate.diff(currentDate, 'minutes');

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

const getTotalRemainMinutes = (dates: Dates[]) => {
    let remainMinutes: number = 0;
    for (const date of dates) {
        remainMinutes += getRemainMinutes(date);
    }
    return remainMinutes;
};

const getRemainMinutes = ({ signOutDate, signInDate }: Dates) => {
    const diffMinutes = signOutDate.diff(signInDate, 'minutes');
    if (diffMinutes === 0) {
        return 0;
    }
    return diffMinutes - 9 * 60;
};

const getDatesByTr = (tr: HTMLTableRowElement): Dates => {
    const currentDate: Moment = moment();
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings: string[] = tr.innerText.split('\t');
    const dateString: string = `${currentDate.year()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate: Moment = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate: Moment = moment(`${dateString} ${datetimeStrings[2]}`);
    const predictedSignOutDate: Moment = signInDate.clone().add(9, 'hours');
    return {
        signInDate,
        predictedSignOutDate,
        signOutDate,
    };
};

const getSignInSignOutDates = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>) => {
    const dates: Dates[] = [];

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        dates.push(getDatesByTr(tr));
    }

    // 根據剩餘分鐘來更新當日的簽退時間
    dates[0].signOutDate = dates[0].signOutDate.clone().subtract(getTotalRemainMinutes(dates), 'minutes');

    return dates;
};

const updateSignInSignOutContent = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, dates: Dates[]) => {
    for (let i = 0; i < dates.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const signOutDate: Moment = dates[i].signOutDate;
        const remainMinutes: number = getRemainMinutes(dates[i]);
        const td: HTMLTableCellElement = tr.getElementsByTagName('td').item(2);
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

const handleTableLoaded = (table: HTMLTableElement) => {
    const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
    const dates: Dates[] = getSignInSignOutDates(trs);
    updateSignInSignOutContent(trs, dates);
    showSignInNotification(dates);
};

const waitingTableLoaded = (callback) => {
    if (window.MutationObserver === undefined) {
        console.warn('請檢查瀏覽器使否支援 MutationObserver');
        return;
    }
    const observer: MutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type !== 'childList' ||
                (mutation.target as HTMLDivElement).id !== 'formTemplate:attend_rec_panel_content'
            ) {
                return;
            }
            waitElementLoaded('formTemplate:attend_rec_datatable_data').then(callback);
        });
    });
    observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true,
    });
};

(function () {
    moment.locale('zh-tw');
    updateFavicon('https://cy.iwerp.net/portal/images/chungyo.ico');
    waitingTableLoaded(handleTableLoaded);
})();
