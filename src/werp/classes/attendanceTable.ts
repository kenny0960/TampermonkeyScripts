import * as moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { getPredictedProgressBar } from '@/werp/classes/progressBar';
import {
    getAttendanceDateTemplate,
    getAttendanceSignInTemplate,
    getAttendanceSignOutTemplate,
    getAttendanceSummaryTemplate,
    getLeaveNoteTemplate,
} from '@/werp/classes/template';
import { getCopyrightAndVersionElement, getSendIcon } from '@/werp/classes/style';
import { getTodayAttendance } from '@/werp/classes/attendanceUtility';
import { HAS_LINE_MESSAGE_API_AUTH } from '@/common/consts/env';

const getAttendanceTableBodyElement = (attendances: Attendance[]): HTMLTableSectionElement => {
    const tableBodyElement: HTMLTableSectionElement = document.createElement('tbody');
    tableBodyElement.style.height = 'fit-content';
    for (let i = 1; i < attendances.length; i++) {
        const attendance: Attendance = attendances[i];
        const attendanceContentElement: HTMLTableRowElement = document.createElement('tr');
        if (isToday(attendance.signInDate) === false) {
            attendanceContentElement.style.opacity = '0.5';
        }
        if (isToday(attendance.signInDate) === true) {
            tableBodyElement.insertAdjacentHTML('afterbegin', getPredictedProgressBar(attendances));
        }
        attendanceContentElement.innerHTML = getAttendanceDateTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignInTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(attendance);
        attendanceContentElement.innerHTML += getLeaveNoteTemplate(attendance.leaveNote);
        tableBodyElement.prepend(attendanceContentElement);
    }
    return tableBodyElement;
};

const getAttendanceTableHeaderElement = (): HTMLTableSectionElement => {
    const tableHeadElement: HTMLTableSectionElement = document.createElement('thead');
    tableHeadElement.innerHTML = `
        <tr>
          <th style="width:100px">
            班表日
          </th>
          <th>
            簽到
          </th>
          <th>
            簽退
          </th>
          <th style="width:150px">
            請假/異常
            <i id="update-leave-note" class="fa fa-refresh" style="cursor: pointer;"></i>
            ${HAS_LINE_MESSAGE_API_AUTH === true ? getSendIcon('send-leave-note').outerHTML : ''}
          </th>
        </tr>
    `;
    tableHeadElement.style.height = '35px';
    return tableHeadElement;
};

export const updateAttendanceSummary = (attendances: Attendance[]): void => {
    document.querySelector('#formTemplate\\:attend_rec_datatable > div > table > tfoot > tr > td:nth-child(3)').innerHTML =
        getAttendanceSummaryTemplate(attendances);
};

export const updatePredictedSignOutTemplate = (attendances: Attendance[]): void => {
    document.querySelector(
        `#formTemplate\\:attend_rec_datatable > div > table > tbody > tr:not(.progress-bar-tr):nth-child(${
            6 - moment().day()
        }) > td:nth-child(3)`
    ).innerHTML = getAttendanceSignOutTemplate(getTodayAttendance(attendances));
};

const getAttendanceTableFooterElement = (attendances: Attendance[]): HTMLTableSectionElement => {
    const tableFooterElement: HTMLTableSectionElement = document.createElement('tfoot');
    tableFooterElement.innerHTML = `
        <tr style="border-top: solid 1px darkgrey;">
            <td>小計</td>
            <td></td>
            <td>${getAttendanceSummaryTemplate(attendances)}</td>
            <td>${getCopyrightAndVersionElement().outerHTML}</td>
        </tr>
    `;
    return tableFooterElement;
};

export const getAttendanceTableElement = (attendances: Attendance[]): HTMLTableElement => {
    const tableElement: HTMLTableElement = document.createElement('table');
    tableElement.style.height = '100%';
    tableElement.append(getAttendanceTableHeaderElement());
    tableElement.append(getAttendanceTableBodyElement(attendances));
    tableElement.append(getAttendanceTableFooterElement(attendances));
    return tableElement;
};
