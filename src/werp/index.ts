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
    getLeaveMinutes,
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
    getProgressBarTemplate,
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
    appendPredictedSignOutProgressBar,
    prependForgottenAttendanceButton,
    removeAllAttendanceContent,
    restyleAttendanceButtons,
    restyleAttendanceTable,
    restyleWholePage,
} from '@/werp/classes/style';
import { resetAttendanceTimers, startAttendanceTimers } from '@/werp/classes/timer';
import ProgressBar from '@/werp/interfaces/ProgressBar';
import { defaultProgressBar } from '@/werp/classes/progressBar';

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

export const updatePredictedSignOutProgressBar = (
    tableSectionElement: HTMLTableSectionElement,
    attendances: Attendance[]
): void => {
    const progressBarElement: HTMLDivElement | null = tableSectionElement.parentElement.querySelector(
        '#predicted-sign-out-progress-bar'
    );
    if (progressBarElement === null) {
        return;
    }
    progressBarElement.innerHTML = getPredictedSignOutInnerHTML(attendances);
};

const getPredictedSignOutInnerHTML = (attendances: Attendance[]): string => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const attendance: Attendance = formatAttendance(todayAttendance);
    const { signInDate }: Attendance = attendance;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        return '';
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(attendance.signOutDate) !== '') {
        return '';
    }

    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const progressBar: ProgressBar = {
        ...defaultProgressBar,
        leftBar: {
            ...defaultProgressBar.leftBar,
            class: 'progress-bar progress-bar-striped progress-bar-animated',
        },
        rightBar: {
            ...defaultProgressBar.rightBar,
            text: formatTime(predictedSignOutDate),
        },
    };

    if (predictedSignOutLeftMinutes > 30) {
        // 確保所有文字都可以顯示，最小 20%
        progressBar.percentage = Math.max(
            Math.floor(100 - (predictedSignOutLeftMinutes / (540 - getLeaveMinutes(attendance))) * 100),
            20
        );
        progressBar.leftBar = {
            text: `預計 ${predictedSignOutDate.fromNow()}`,
            class: `${progressBar.leftBar.class} bg-secondary`,
        };
        progressBar.rightBar.color = 'black';
    } else if (predictedSignOutLeftMinutes > 0) {
        progressBar.percentage = Math.floor(100 - (predictedSignOutLeftMinutes / (540 - getLeaveMinutes(attendance))) * 100);
        progressBar.leftBar = {
            text: `預計 ${predictedSignOutLeftMinutes.toString()} 分鐘後`,
            class: `${progressBar.leftBar.class} bg-success`,
        };
        progressBar.rightBar.color = 'white';
    } else {
        progressBar.percentage = 100;
        progressBar.leftBar = {
            text: '符合下班條件',
            class: `${progressBar.leftBar.class} bg-warning`,
        };
        progressBar.rightBar.color = 'white';
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        progressBar.percentage = 100;
        progressBar.leftBar = {
            text: `超時工作 (+${Math.abs(todaySignOutLeftMinutes)})`,
            class: `${progressBar.leftBar.class} bg-danger`,
        };
        progressBar.rightBar.color = 'white';
    }

    return getProgressBarTemplate(progressBar);
};

const getSignOutInnerHTML = (attendance: Attendance): string => {
    const signInTimeString: string = formatTime(attendance.signInDate);
    const signOutTimeString: string = formatTime(attendance.signOutDate);

    // 國定假日或請假
    if (signOutTimeString === '' && signInTimeString === '') {
        return '';
    }

    // 未簽到：不再預測可簽退時間
    if (signOutTimeString === '') {
        return '';
    }

    const remainMinutes: number = getRemainMinutes(attendance);
    // 顯示超過或不足的分鐘數
    return `${signOutTimeString} <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (tableSectionElement: HTMLTableSectionElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        const attendance: Attendance = attendances[i];
        const attendanceContentElement: HTMLTableRowElement = document.createElement('tr');
        if (isToday(attendance.signInDate) === false) {
            attendanceContentElement.style.opacity = '0.5';
        }
        if (isToday(attendance.signInDate) === true) {
            attendanceContentElement.className = 'today';
        }
        attendanceContentElement.innerHTML = getAttendanceDateTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignInTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getSignOutInnerHTML(attendance));
        attendanceContentElement.innerHTML += getLeaveNoteTemplate(attendance.leaveNote);
        tableSectionElement.prepend(attendanceContentElement);
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

const attendanceMain = async (tableSectionElement: HTMLTableSectionElement): Promise<void> => {
    if (tableSectionElement.parentElement.parentElement.innerText.includes('ⓚ design') === true) {
        return;
    }
    initializeFaviconBadge();
    resetAttendanceTimers();
    log('出缺勤表格已經載入');
    const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = tableSectionElement.getElementsByTagName('tr');
    const firstDayAttendance: Attendance = getAttendanceByTr(trs.item(0));
    // TODO 優化後打開
    //const leaveNotes: LeaveNote[] = await fetchPersonalLeaveNotes(firstDayAttendance);
    const attendances: Attendance[] = getAttendanceByTrs(trs, []);
    removeAllAttendanceContent(tableSectionElement);
    appendLeaveNoteCaption(tableSectionElement);
    updateAttendanceContent(tableSectionElement, attendances);
    appendPredictedSignOutProgressBar(tableSectionElement, getPredictedSignOutInnerHTML(attendances));
    appendCopyrightAndVersion(tableSectionElement);
    prependForgottenAttendanceButton();
    restyleAttendanceButtons();
    restyleAttendanceTable(tableSectionElement);
    restyleWholePage();
    startAttendanceTimers(tableSectionElement, attendances);
};

const taskMain = async (table: HTMLTableElement): Promise<void> => {
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
};

const main = (): void => {
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(attendanceMain);
    // TODO 優化後打開
    // waitElementLoaded('.waitingTaskMClass').then(taskMain);
};

(function () {
    moment.locale('zh-tw');
    main();
    // TODO 優化後打開
    // window.setInterval((): void => {
    //     waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(attendanceMain);
    // }, 5 * 1000);
    // 覆寫 WERP 原有函式
    // reloadNewHome = (): void => {
    //     location.reload();
    // };
})();
