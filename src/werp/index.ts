import * as moment from 'moment';
import 'favIcon-badge';

import { log } from '@/common/logger';
import { waitElementLoaded } from '@/common/dom';
import SessionManager from '@/common/SessionManager';
import { Moment } from '@/moment';
import Attendance from '@/werp/interfaces/Attendance';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import SessionKeys from '@/werp/enums/SessionKeys';
import {
    formatAttendance,
    getPredictedSignOutDate,
    getRemainMinutes,
    getTodayAttendance,
    getWeekAttendances,
} from '@/werp/classes/attendanceUtility';
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
import { initializeFaviconBadge } from '@/werp/classes/favicon';
import {
    appendCopyrightAndVersion,
    appendLeaveNoteCaption,
    prependForgottenAttendanceButton,
    removeAllAttendanceContent,
    restyleAttendanceButtons,
    restyleAttendanceTable,
    restyleWholePage,
} from '@/werp/classes/style';
import { resetAttendanceTimers, startAttendanceTimers } from '@/werp/classes/timer';

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

export const updateTodayAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]): void => {
    const index: number = 5 - moment().day();
    const todayAttendanceContentElement: HTMLTableRowElement = table.getElementsByTagName('tr').item(index);
    const todayAttendanceSignOutElement: HTMLTableCellElement = todayAttendanceContentElement
        .getElementsByTagName('td')
        .item(2);
    todayAttendanceSignOutElement.innerHTML = getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));
};

const getTodayAttendanceInnerHTML = (attendances: Attendance[]): string => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const attendance: Attendance = formatAttendance(todayAttendance);
    const { signInDate }: Attendance = attendance;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        return '';
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(attendance.signOutDate) !== '') {
        return getPastDayAttendanceInnerHTML(attendance);
    }

    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
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
