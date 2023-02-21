import * as moment from 'moment';
import 'favIcon-badge';

import { log } from '@/common/logger';
import { waitElementLoaded } from '@/common/dom';
import { Moment } from '@/moment';
import Attendance from '@/werp/interfaces/Attendance';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import { getWeekAttendances } from '@/werp/classes/attendanceUtility';
import { getAnnualLeaveTemplate, getCompanyEmployeeTemplate, getLeaveReceiptNotesTemplate } from '@/werp/classes/template';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import { appendUpdateLeaveNoteFunction, defaultLeaveNote } from '@/werp/classes/leaveNote';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import { initializeFaviconBadge } from '@/werp/classes/favicon';
import {
    prependForgottenAttendanceButton,
    restyleAttendanceButtons,
    restyleAttendanceTable,
    restyleWholePage,
} from '@/werp/classes/style';
import { resetAttendanceTimers, startAttendanceTimers } from '@/werp/classes/timer';
import { getAnnualLeave, getLeaveNotes, getLeaveReceiptNotes } from '@/werp/classes/sessionManager';
import { sleep } from '@/common/timer';
import { appendUpdateAnnualLeaveFunction } from '@/werp/classes/annualLeave';
import { getPickedYear } from '@/werp/classes/calendar';
import { appendUpdateLeaveReceiptNoteFunction } from '@/werp/classes/LeaveReceiptNote';
import { getAttendanceTableElement } from '@/werp/classes/attendanceTable';
import { displayCompanyEmployeeCountLineChart } from '@/werp/classes/companyEmployeeCount';

const getAttendanceByTr = (tr: HTMLTableRowElement): Attendance => {
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings: string[] = tr.innerText.split('\t');
    const dateString: string = `${getPickedYear()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate: Moment = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate: Moment = moment(`${dateString} ${datetimeStrings[2]}`);
    return {
        signInDate,
        signOutDate,
        leaveNote: defaultLeaveNote,
    };
};

const getAttendanceByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, leaveNotes: LeaveNote[]): Attendance[] => {
    const attendances: Attendance[] = getWeekAttendances(leaveNotes);

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

const attendanceMain = async (tableSectionElement: HTMLTableSectionElement): Promise<void> => {
    const wrapperElement: HTMLDivElement = tableSectionElement.parentElement.parentElement as HTMLDivElement;
    if (wrapperElement.innerText.includes('ⓚ design') === true) {
        return;
    }
    initializeFaviconBadge();
    resetAttendanceTimers();
    log('出缺勤表格已經載入');
    const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = tableSectionElement.getElementsByTagName('tr');
    const leaveNotes: LeaveNote[] = await getLeaveNotes();
    const attendances: Attendance[] = getAttendanceByTrs(trs, leaveNotes);
    wrapperElement.querySelector('table').remove();
    wrapperElement.append(getAttendanceTableElement(attendances));
    appendUpdateLeaveNoteFunction();

    const newTableSectionElement: HTMLTableSectionElement = wrapperElement.querySelector('table > tbody');
    prependForgottenAttendanceButton();
    restyleAttendanceButtons();
    restyleAttendanceTable(newTableSectionElement);
    restyleWholePage();
    startAttendanceTimers(newTableSectionElement, attendances);
};

const taskMain = async (table: HTMLTableElement): Promise<void> => {
    await sleep(1);
    if (table.innerText.includes('特休狀況') === true) {
        return;
    }
    log('待辦事項表格已經載入');
    const annualLeave: AnnualLeave | null = await getAnnualLeave();
    const leaveReceiptNotes: LeaveReceiptNote[] = await getLeaveReceiptNotes();
    const companyEmployeeTemplate: string = getCompanyEmployeeTemplate();
    const annualTemplate: string = getAnnualLeaveTemplate(annualLeave);
    const leaveReceiptNotesTemplate: string = getLeaveReceiptNotesTemplate(leaveReceiptNotes);
    table.insertAdjacentHTML('afterbegin', annualTemplate);
    appendUpdateAnnualLeaveFunction();
    table.insertAdjacentHTML('afterbegin', leaveReceiptNotesTemplate);
    appendUpdateLeaveReceiptNoteFunction();
    table.insertAdjacentHTML('afterend', companyEmployeeTemplate);
    await displayCompanyEmployeeCountLineChart();
};

const main = (): void => {
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(attendanceMain);
    waitElementLoaded('.waitingTaskMClass').then(taskMain);
};

(function () {
    moment.locale('zh-tw');
    main();
    window.setInterval((): void => {
        waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(attendanceMain);
    }, 5 * 1000);
    // 覆寫 WERP 原有函式
    reloadNewHome = (): void => {
        location.reload();
    };
})();
