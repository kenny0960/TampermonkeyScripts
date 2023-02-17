import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { getPredictedProgressBar } from '@/werp/classes/progressBar';
import {
    getAttendanceDateTemplate,
    getAttendanceSignInTemplate,
    getAttendanceSignOutTemplate,
    getLeaveNoteTemplate,
} from '@/werp/classes/template';
import { getSummaryRemainMinutes } from '@/werp/classes/attendanceUtility';
import { getCopyrightAndVersionElement } from '@/werp/classes/style';

const getAttendanceTableBodyElement = (attendances: Attendance[]): HTMLTableSectionElement => {
    const tableBodyElement: HTMLTableSectionElement = document.createElement('tbody');
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
          </th>
        </tr>
    `;
    tableHeadElement.style.height = '35px';
    return tableHeadElement;
};

const getAttendanceTableFooterElement = (attendances: Attendance[]): HTMLTableSectionElement => {
    const tableFooterElement: HTMLTableSectionElement = document.createElement('tfoot');
    const remainMinutes: number = getSummaryRemainMinutes(attendances);
    tableFooterElement.innerHTML = `
        <tr style="border-top: solid 1px darkgrey;">
            <td>小計</td>
            <td></td>
            <td style="letter-spacing: 1px; font-weight: bold; color: ${remainMinutes >= 0 ? 'green' : 'red'};">
                ${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes}
            </td>
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
