import * as moment from 'moment';
import 'favIcon-badge';

import { log } from '@/common/logger';
import { insertFaviconHTML } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import SessionManager from '@/common/SessionManager';
import { Moment } from '@/moment';
import * as PackageJson from '@/../package.json';
import Attendance from '@/werp/interfaces/Attendance';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import SessionKeys from '@/werp/enums/SessionKeys';
import { getTodayAttendance, getWeekAttendances } from '@/werp/classes/attendanceUtility';
import { formatTime, isToday } from '@/werp/classes/momentUtility';
import {
    getAnnualLeaveTemplate,
    getAttendanceDateTemplate,
    getAttendanceSignInTemplate,
    getAttendanceSignOutTemplate,
    getCompanyEmployeeTemplate,
    getLeaveNoteTemplate,
    getLeaveReceiptNotesTemplate,
} from '@/werp/classes/template';
import {
    fetchAllCompanyEmployeeCount,
    fetchAnnualLeave,
    fetchPersonalLeaveNotes,
    fetchPersonalLeaveReceiptNotes,
} from '@/werp/classes/ajax';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import { defaultLeaveNote } from '@/werp/classes/leaveNote';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import UPDATE_LOGS from '@/werp/consts/UpdateLogs';
import UpdateLog from '@/werp/interfaces/UpdateLog';

const showSignInNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signInDate, signOutDate }: Attendance = formatAttendance(todayAttendance);
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(currentDate, 'minutes');
    const currentDateString: string = currentDate.format('YYYYMMDD', { trim: false });

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '已經簽退',
            {
                body: '請馬上離開辦公室',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION, currentDateString);
            }
        );
        return;
    }

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽到',
            {
                body: '尚未有簽到的紀錄',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );
        return;
    }

    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        if (SessionManager.getByKey(SessionKeys.OFF_WORK_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(SessionKeys.OFF_WORK_NOTIFICATION, currentDateString);
            }
        );
    }
    // 即將下班
    else if (predictedSignOutLeftMinutes < 30) {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `${predictedSignOutLeftMinutes > 0 ? `預計 ${predictedSignOutDate.fromNow()}下班` : '符合下班條件'}`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
            }
        );
    }

    const signInNotificationTimer: number = window.setTimeout(
        (): void => showSignInNotification(attendances),
        5 * 60 * 1000
    );
    SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER, String(signInNotificationTimer));
};

const formatEarliestSignInDate = (signInDate: Moment): Moment => {
    const signInDateString: string = signInDate.format('YYYY/MM/DD', { trim: false });
    // 打卡最早只能計算到 08:00
    if (signInDate.isBefore(moment(`${signInDateString} 08:00`))) {
        return moment(`${signInDateString} 08:00`);
    }
    // 如果打卡時間介於午休時間只能從 13:30 開始計算
    if (signInDate.isBetween(moment(`${signInDateString} 12:30`), moment(`${signInDateString} 13:30`))) {
        return moment(`${signInDateString} 13:30`);
    }
    return signInDate;
};

const formatEarliestSignOutDate = (signOutDate: Moment): Moment => {
    const signOutDateString: string = signOutDate.format('YYYY/MM/DD', { trim: false });
    const earliestSignOutDate: Moment = moment(`${signOutDateString} 17:00`);
    if (signOutDate.isBefore(earliestSignOutDate)) {
        return earliestSignOutDate;
    }
    return signOutDate;
};

const formatAttendance = (attendance: Attendance): Attendance => {
    return {
        ...attendance,
        signInDate: formatEarliestSignInDate(attendance.signInDate),
    };
};

const getTotalRemainMinutes = (attendances: Attendance[]): number => {
    let remainMinutes: number = 0;
    for (let i = 1; i < attendances.length; i++) {
        // 國定假日或請假直接不計算
        if (getWorkingMinutes(attendances[i]) === 0) {
            continue;
        }
        remainMinutes += getRemainMinutes(attendances[i]);
    }
    return remainMinutes;
};

const getWorkingMinutes = ({ signOutDate, signInDate }: Attendance): number => {
    return signOutDate.diff(signInDate, 'minutes');
};

const getLeaveMinutes = ({ signInDate, leaveNote }: Attendance): number => {
    const matches: RegExpMatchArray | null = leaveNote.receiptNote.match(/^(?<leaveTime>\d+)-(?<backTime>\d+).+$/);

    if (matches === null || matches.length === 0) {
        return 0;
    }

    const { leaveTime, backTime } = matches.groups;
    const date: string = signInDate.format('YYYY/MM/DD', { trim: false });
    const leaveDate: Moment = moment(`${date} ${leaveTime.slice(0, 2)}:${leaveTime.slice(2, 4)}`);
    const backDate: Moment = moment(`${date} ${backTime.slice(0, 2)}:${backTime.slice(2, 4)}`);

    // 上班途中請假不算累積分鐘
    if (signInDate.isBefore(leaveDate)) {
        return 0;
    }

    return backDate.diff(leaveDate, 'minutes');
};

const getRemainMinutes = (attendance: Attendance): number => {
    return getWorkingMinutes(formatAttendance(attendance)) + getLeaveMinutes(attendance) - 9 * 60;
};

export const getCurrentYear = (): number => {
    const yearElement: HTMLSpanElement | null = document.querySelector('.ui-datepicker-year');

    if (yearElement === null) {
        return moment().year();
    }

    return Number(yearElement.innerText);
};

const getAttendanceByTr = (tr: HTMLTableRowElement): Attendance => {
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings: string[] = tr.innerText.split('\t');
    const dateString: string = `${getCurrentYear()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate: Moment = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate: Moment = moment(`${dateString} ${datetimeStrings[2]}`);
    return {
        signInDate,
        signOutDate,
        leaveNote: defaultLeaveNote,
    };
};

const getAttendanceByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, leaveNotes: LeaveNote[]): Attendance[] => {
    const firstDayAttendance: Attendance = getAttendanceByTr(trs.item(0));
    const attendances: Attendance[] = getWeekAttendances(firstDayAttendance, leaveNotes);

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const attendance: Attendance = getAttendanceByTr(tr);

        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        attendances[attendance.signOutDate.day()] = {
            ...attendances[attendance.signOutDate.day()],
            signInDate: attendance.signInDate,
            signOutDate: attendance.signOutDate,
        };
    }

    return attendances;
};

const updateTodayAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]): void => {
    const index: number = 5 - moment().day();
    const todayAttendanceContentElement: HTMLTableRowElement = table.getElementsByTagName('tr').item(index);
    const todayAttendanceSignOutElement: HTMLTableCellElement = todayAttendanceContentElement
        .getElementsByTagName('td')
        .item(2);
    todayAttendanceSignOutElement.innerHTML = getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));

    // 定時更新內容
    const todayAttendanceContentTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班內容');
        updateTodayAttendanceContent(table, attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER, String(todayAttendanceContentTimer));
};

const getTodayAttendanceInnerHTML = (attendances: Attendance[]): string => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const attendance: Attendance = formatAttendance(todayAttendance);
    const { signOutDate, signInDate }: Attendance = attendance;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        return '';
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(attendance.signOutDate) !== '') {
        return getPastDayAttendanceInnerHTML(attendance);
    }

    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutTimeString: string = formatTime(predictedSignOutDate);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');

    let innerHTML: string = `<div style="font-size: 20px;"> ${predictedSignOutTimeString} </div>`;
    if (predictedSignOutLeftMinutes > 0) {
        innerHTML += `<div style="font-size: 12px;"> 預計 ${predictedSignOutDate.fromNow()} </div>`;
    } else {
        innerHTML += `<div style="font-size: 12px;"> 符合下班條件 </div>`;
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        innerHTML = `<div style="font-size: 12px;"> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+${Math.abs(
            todaySignOutLeftMinutes
        )})</span></div>`;
    }
    return innerHTML;
};

const getPastDayAttendanceInnerHTML = (attendance: Attendance): string => {
    const signInTimeString: string = formatTime(attendance.signInDate);
    const signOutTimeString: string = formatTime(attendance.signOutDate);

    // 國定假日或請假
    if (signOutTimeString === '' && signInTimeString === '') {
        return '';
    }

    const remainMinutes: number = getRemainMinutes(attendance);
    // 顯示超過或不足的分鐘數
    return `${signOutTimeString} <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        const attendance: Attendance = attendances[i];
        const attendanceContentElement: HTMLTableRowElement = document.createElement('tr');
        if (isToday(attendance.signInDate) === false) {
            attendanceContentElement.style.opacity = '0.5';
        }
        attendanceContentElement.innerHTML = getAttendanceDateTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignInTemplate(attendance);
        if (isToday(attendance.signInDate) === true) {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));
        } else {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getPastDayAttendanceInnerHTML(attendance));
        }
        attendanceContentElement.innerHTML += getLeaveNoteTemplate(attendance.leaveNote);
        table.prepend(attendanceContentElement);
    }
};

const updateAttendanceFavicon = (attendances: Attendance[]) => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signOutDate, signInDate }: Attendance = formatAttendance(todayAttendance);
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const faviconBadge: FavIconBadge = document.querySelector('favicon-badge');
    faviconBadge.textColor = 'white';
    faviconBadge.badgeSize = 16;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        document.title = '未簽到';
        faviconBadge.badgeColor = '#cc0000';
        faviconBadge.badge = '未';
        return;
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        document.title = '已經簽退';
        faviconBadge.badgeColor = '#3399ff';
        faviconBadge.badge = '離';
        return;
    }

    if (predictedSignOutLeftMinutes > 60) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#737373';
        faviconBadge.badge = `${predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1]}H`;
    } else if (predictedSignOutLeftMinutes > 0) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#006600';
        faviconBadge.badge = predictedSignOutLeftMinutes.toString();
    } else {
        document.title = '符合下班條件';
        faviconBadge.badgeColor = '#e69500';
        faviconBadge.badge = '可';
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        document.title = `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`;
        faviconBadge.badgeColor = '#cc0000';
        faviconBadge.badge = '超';
    }

    // 定時更新內容
    const todayAttendanceFaviconTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班 Favicon');
        updateAttendanceFavicon(attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER, String(todayAttendanceFaviconTimer));
};

const stringifyUpdateLog = (updateLog: UpdateLog): string => {
    return `v${updateLog.version} ${updateLog.date} ${updateLog.messages}`;
};

const appendCopyrightAndVersion = (body: HTMLElement): void => {
    const copyRightDiv: HTMLDivElement = document.createElement('div');
    copyRightDiv.innerText = `ⓚ design © V${PackageJson['wrep-version']}`;
    copyRightDiv.style.textAlign = 'right';
    copyRightDiv.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    body.append(copyRightDiv);
};

const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER)));
};

const startAttendanceTimers = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        if (isToday(attendances[i].signInDate) === true) {
            updateTodayAttendanceContent(table, attendances);
            updateAttendanceFavicon(attendances);
            showSignInNotification(attendances);
        }
    }
};

const initializeFaviconBadge = (): void => {
    document.querySelectorAll('favicon-badge').forEach((faviconBadge: FavIconBadge) => {
        faviconBadge.remove();
    });
    document.querySelectorAll('link[rel="shortcut icon"]').forEach((linkElement: HTMLLinkElement) => {
        linkElement.remove();
    });
    insertFaviconHTML(`<favicon-badge src="" />`);
};

const createAttendanceButton = (text: string, link: string): HTMLElement => {
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.href = link;
    anchorElement.innerText = text;
    anchorElement.title = text;
    anchorElement.className =
        'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only atnd-btn common-btn atndreccssBth attendBtnCss';
    anchorElement.target = '_blank';
    anchorElement.style.background = 'white';
    anchorElement.style.border = '1px solid #c4c4c4';
    anchorElement.style.boxSizing = 'border-box';
    anchorElement.style.boxShadow = '0px 2px 5px rgb(0 0 0 / 25%)';
    anchorElement.style.borderRadius = '4px';
    anchorElement.style.width = 'fit-content';
    anchorElement.style.padding = '0 3px';
    return anchorElement;
};

const prependForgottenAttendanceButton = (): void => {
    const toolbarElement: HTMLTableElement | null = document.querySelector(
        'table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content'
    );
    if (toolbarElement === null || toolbarElement.innerText.includes('忘簽到退') === true) {
        log('忘簽到退按鍵已經載入');
        return;
    }
    const forgottenAttendanceButton: HTMLElement = createAttendanceButton(
        '忘簽到退',
        '/hr-attendance/acs/personal/personal-acs-aply.xhtml'
    );
    toolbarElement.prepend(forgottenAttendanceButton);
};

const restyleAttendanceButtons = (): void => {
    document
        .querySelectorAll('table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content button,span,a')
        .forEach((buttonElement: HTMLButtonElement): void => {
            buttonElement.style.marginRight = '4px';
        });
};

const removeAllAttendanceContent = (table: HTMLTableElement): void => {
    table.querySelectorAll('tr').forEach((tr: HTMLTableRowElement) => {
        tr.remove();
    });
};

const updateCompanyEmployeeCountSession = (companyEmployeeCount: number | null): void => {
    if (companyEmployeeCount === null) {
        return;
    }
    const year: number = moment().year();
    const week: number = moment().week();
    const companyEmployeeCountObject: Object = SessionManager.getObjectByKey(SessionKeys.COMPANY_EMPLOYEE_COUNT);
    companyEmployeeCountObject[year] = {
        ...companyEmployeeCountObject[year],
        [week]: companyEmployeeCount,
    };
    SessionManager.setByKey(SessionKeys.COMPANY_EMPLOYEE_COUNT, JSON.stringify(companyEmployeeCountObject));
};

const appendLeaveNoteCaption = (table: HTMLTableElement): void => {
    const leaveCaption: HTMLTableCaptionElement = document.createElement('th');
    leaveCaption.innerHTML = '<span class="ui-column-title">請假/異常</span>';
    table.parentNode.querySelector('thead tr').append(leaveCaption);
};

const restyleAttendanceTable = (table: HTMLTableElement): void => {
    table.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.style.height = '100%';
    table.parentElement.style.height = '90%';
};

const restyleWholePage = (): void => {
    document.querySelector('#todo-bpm').parentElement.className = document
        .querySelector('#todo-bpm')
        .parentElement.className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#right-top-layout').className = document
        .querySelector('#right-top-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
    document.querySelector('#anno-layout').className = document
        .querySelector('#anno-layout')
        .className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#check-in-out-layout').className = document
        .querySelector('#check-in-out-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(
        async (table: HTMLTableElement): Promise<void> => {
            if (table.parentElement.parentElement.innerText.includes('ⓚ design') === true) {
                return;
            }
            initializeFaviconBadge();
            resetAttendanceTimers();
            log('出缺勤表格已經載入');
            const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
            const firstDayAttendance: Attendance = getAttendanceByTr(trs.item(0));
            const leaveNotes: LeaveNote[] = await fetchPersonalLeaveNotes(firstDayAttendance);
            const attendances: Attendance[] = getAttendanceByTrs(trs, leaveNotes);

            removeAllAttendanceContent(table);
            appendLeaveNoteCaption(table);
            updateAttendanceContent(table, attendances);
            appendCopyrightAndVersion(table.parentElement.parentElement);
            prependForgottenAttendanceButton();
            restyleAttendanceButtons();
            restyleAttendanceTable(table);
            restyleWholePage();
            startAttendanceTimers(table, attendances);
        }
    );

    // 待辦事項表格
    waitElementLoaded('.waitingTaskMClass').then(async (table: HTMLTableElement): Promise<void> => {
        if (table.innerText.includes('特休狀況') === true) {
            return;
        }
        log('待辦事項表格已經載入');
        const annualLeave: AnnualLeave | null = await fetchAnnualLeave();
        const leaveReceiptNotes: LeaveReceiptNote[] = await fetchPersonalLeaveReceiptNotes();
        const companyEmployeeCount: number | null = await fetchAllCompanyEmployeeCount();
        const annualTemplate: string = getAnnualLeaveTemplate(annualLeave);
        const leaveReceiptNotesTemplate: string = getLeaveReceiptNotesTemplate(leaveReceiptNotes);
        const companyEmployeeTemplate: string = getCompanyEmployeeTemplate(
            companyEmployeeCount,
            SessionManager.getObjectByKey(SessionKeys.COMPANY_EMPLOYEE_COUNT)
        );
        updateCompanyEmployeeCountSession(companyEmployeeCount);
        table.insertAdjacentHTML('afterbegin', annualTemplate);
        table.insertAdjacentHTML('afterbegin', leaveReceiptNotesTemplate);
        // TODO 暫時隱藏公司狀況
        // table.insertAdjacentHTML('beforeend', companyEmployeeTemplate);
    });
};

(function () {
    moment.locale('zh-tw');
    main();
    window.setInterval((): void => {
        main();
    }, 5 * 1000);
    // 覆寫 WERP 原有函式
    reloadNewHome = (): void => {
        location.reload();
    };
})();
