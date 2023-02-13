import * as moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { formatDatetime, formatTime, formatWeekday, isToday } from '@/werp/classes/momentUtility';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import ProgressBar from '@/werp/interfaces/ProgressBar';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { Moment } from '@/moment';

export const getProgressBarTemplate = (progressBar: ProgressBar): string => {
    return `
        <tr style="display: none;"></tr>
        <tr id="predicted-sign-out-progress-bar">
            <td colspan="4" style="padding-top: 0; height: 35px;">
                <div style="position: relative;">
                    <div class="progress" style="height: 30px;">
                        <div class="${progressBar.leftBar.class}" style="width: ${progressBar.percentage}%; font-size: 16px; font-weight: bold">${progressBar.leftBar.text}</div>
                    </div>
                    <div style="position: absolute;top: 0;right: 12px;font-size: 18px;font-weight: bold;line-height: 30px;color: ${progressBar.rightBar.color};">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>${progressBar.rightBar.text}
                    </div>
                </div>
            </td>
        </tr>
    `;
};

export const getAnnualLeaveTemplate = (annualLeave: AnnualLeave | null): string => {
    if (annualLeave === null) {
        return '';
    }
    const lastUpdateDatetime: string = moment(
        Number(SessionManager.getByKey(SessionKeys.AJAX_ANNUAL_LEAVE_TIMESTAMP))
    ).fromNow();
    return `
        <div id="annual-leave-template">
            <div class="ui-outputpanel ui-widget">
              <div class="ui-g-12 waiting-task-g">
                <div class="title-name ui-g-4 ">特休狀況
                </div>
                <div class="ui-g-8 ">
                  <span class="todocss">
                    <ul class="todo-ul-list">
                      <li>
                        <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
                        <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
                        已休(含在途)：${annualLeave.leaveHours}
                      </li>
                      <li>
                        <img id="formTemplate:j_idt329:2:j_idt332" src="/portal/javax.faces.resource/werp_red.png.xhtml?ln=images" alt="">
                        <label id="formTemplate:j_idt329:2:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
                        <a href="/hr-attendance/leave/personal/personal-apply.xhtml" target="_blank" class="select-link-red">未休：${annualLeave.notLeaveHours}</a>
                      </li>
                      <li>
                        <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
                        <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
                        有效日：${annualLeave.endDatetime}
                      </li>
                      <li style="text-align: end;font-size: 12px;">
                        最後更新：${lastUpdateDatetime}
                        <i id="update-annual-leave" class="fa fa-refresh" style="cursor: pointer;"></i>
                      </li>
                    </ul>
                  </span>
                </div>
              </div>
            </div>
            <table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>
        </div>
    `;
};

export const getLeaveReceiptNotesTemplate = (leaveReceiptNotes: LeaveReceiptNote[]): string => {
    const templates: string[] = [];
    const lastUpdateDatetime: string = moment(
        Number(SessionManager.getByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES_TIMESTAMP))
    ).fromNow();
    for (const leaveReceiptNote of leaveReceiptNotes.reverse()) {
        const startDate: Moment = moment(leaveReceiptNote.start);
        const endDate: Moment = moment(leaveReceiptNote.end);
        // 不顯示已結案的過往記錄
        if (leaveReceiptNote.status === '結案' && startDate.isBefore(moment()) === true) {
            continue;
        }
        templates.push(`
            <tr style="${startDate.isBefore(moment()) ? 'opacity: 0.5;' : ''}" >
                <td class="align-middle">
                    ${
                        leaveReceiptNote.status === '結案'
                            ? '<i style="color: darkgreen;" class="fa fa-1 fa-check-square-o"></i>'
                            : '<i style="color: chocolate;" class="fa fa-spinner fa-1 fa-spin fa-fw"></i>'
                    }
                </td>
                <td class="align-middle">
                    ${leaveReceiptNote.type}
                </td>
                <td class="align-middle">
                    ${startDate.format('YYYY/MM/DD (dd) HH:mm', { trim: false })}
                    <br />
                    ${endDate.format('YYYY/MM/DD (dd) HH:mm', { trim: false })}
                </td>
                <td class="align-middle">
                    ${leaveReceiptNote.hours}
                </td>
                <td class="align-middle">
                    ${leaveReceiptNote.status}
                </td>
                 <td class="align-middle">
                    ${startDate.fromNow()}
                </td>
            </tr>
        `);
    }

    if (templates.length === 0) {
        return '';
    }

    return `
<div id="formTemplate:j_idt323" class="ui-outputpanel ui-widget">
  <div class="ui-g-12 waiting-task-g">
    <div class="title-name ui-g-4">近期請假狀況</div>
    <div class="ui-g-8">
      <span class="todocss">
        <table style="font-size: 12px; margin-bottom: 0;" class="table table-sm text-center">
          <caption class="text-right" style="color: #4f4f4f; padding-bottom: 0;">
            最後更新：${lastUpdateDatetime}
            <i id="update-leave-receipt-note" class="fa fa-refresh" style="cursor: pointer;"></i>
          </caption>
          <thead class="table-borderless">
            <tr>
              <th style="width:8px"></th>
              <th>假別</th>
              <th style="width:130px">時間</th>
              <th style="width:40px">小時</th>
              <th>狀態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${templates.join('')}
          </tbody>
        </table>
      </span>
    </div>
  </div>
</div>
<table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>
    `;
};

export const getCompanyEmployeeTemplate = (
    companyEmployeeCount: number | null,
    companyEmployeeCountObject: Object
): string => {
    if (companyEmployeeCount === null) {
        return '';
    }
    const year: number = moment().year();
    const week: number = moment().week();
    const thisYearCompanyEmployeeCountObject: Object = companyEmployeeCountObject[year];
    const lastWeekCompanyEmployeeCount: number | undefined =
        thisYearCompanyEmployeeCountObject === undefined ? undefined : thisYearCompanyEmployeeCountObject[week - 1];
    return `
<table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>
<div id="formTemplate:j_idt323" class="ui-outputpanel ui-widget">
  <div class="ui-g-12 waiting-task-g">
    <div class="title-name ui-g-4 ">公司狀況
    </div>
    <div class="ui-g-8 ">
      <span class="todocss">
        <ul class="todo-ul-list">
          <li>
            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
            在職人數：${companyEmployeeCount}
          </li>
          <li>
            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
            周趨勢：${
                lastWeekCompanyEmployeeCount === undefined || lastWeekCompanyEmployeeCount === companyEmployeeCount
                    ? `<i class="fa fa-arrows-h" aria-hidden="true"></i>`
                    : lastWeekCompanyEmployeeCount > companyEmployeeCount
                    ? `<i class="fa fa-arrow-down" style="color: red" title="少了 ${
                          lastWeekCompanyEmployeeCount - companyEmployeeCount
                      } 人" aria-hidden="true"></i>`
                    : `<i class="fa fa-arrow-up" style="color: green" title="多了 ${
                          companyEmployeeCount - lastWeekCompanyEmployeeCount
                      } 人" aria-hidden="true"></i>`
            }
          </li>
        </ul>
      </span>
    </div>
  </div>
</div>
    `;
};

export const getAttendanceDateTemplate = (attendance: Attendance): string => {
    return `
        <td role="gridcell">
            ${attendance.signInDate.format('MM/DD', { trim: false })} (${formatWeekday(attendance.signInDate)})
        </td>
    `;
};

export const getAttendanceSignInTemplate = (attendance: Attendance): string => {
    const time: string = formatTime(attendance.signInDate);
    return `
        <td role="gridcell" style="text-align: center;">
            ${
                time === '' && isToday(attendance.signInDate) === true
                    ? `<i style="color: crimson;" class="fa fa-1 fa-exclamation-triangle" aria-hidden="true"></i> 未簽到`
                    : time
            }
        </td>
    `;
};

export const getAttendanceSignOutTemplate = (innerHTML: string): string => {
    return `
        <td role="gridcell" style="text-align: center;">
            ${innerHTML}
        </td>
    `;
};

export const getLeaveNoteTemplate = ({ unusualNote, unsignedNote, receiptNote }: LeaveNote): string => {
    const icons: string[] = [];

    if (unusualNote !== '') {
        icons.push(`
            <div title="${unusualNote}">
                <i style="color: crimson;" class="fa fa-1 fa-exclamation-triangle" aria-hidden="true"></i> 異常
                <div style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 50%;
                    margin-left: 25%;"
                >${unusualNote}</div>
            </div>`);
    }

    if (unsignedNote !== '') {
        icons.push(`
            <div title="${unsignedNote}">
                <i style="color: chocolate;" class="fa fa-spinner fa-1 fa-spin fa-fw"></i> 簽核中
                <div style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 50%;
                    margin-left: 25%;"
                >${unsignedNote}</div>
            </div>`);
    }

    if (receiptNote !== '') {
        icons.push(`
            <div title="${receiptNote}">
                <i style="color: darkgreen;" class="fa fa-1 fa-check-square-o" aria-hidden="true"></i> 請假
                <div style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 50%;
                    margin-left: 25%;"
                >${receiptNote}</div>
            </div>`);
    }

    return `
        <td role="gridcell" style="text-align: center;">
            ${icons.join('')}
        </td>
    `;
};
