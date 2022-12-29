import Attendance from '@/werp/interfaces/Attendance';
import { formatTime, formatWeekday, isToday } from '@/werp/classes/momentUtility';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import * as moment from 'moment';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';

export const getAnnualLeaveTemplate = (annualLeave: AnnualLeave | null): string => {
    if (annualLeave === null) {
        return '';
    }
    return `
<div id="formTemplate:j_idt323" class="ui-outputpanel ui-widget">
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
        </ul>
      </span>
    </div>
  </div>
</div>
<table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>
    `;
};

export const getLeaveReceiptNotesTemplate = (leaveReceiptNotes: LeaveReceiptNote[]): string => {
    const templates: string[] = [];
    for (const leaveReceiptNote of leaveReceiptNotes.reverse()) {
        // 不顯示已結案的過往記錄
        if (leaveReceiptNote.status === '結案' && leaveReceiptNote.start.isBefore(moment()) === true) {
            continue;
        }
        templates.push(`
            <tr data-ri="0" style="${
                leaveReceiptNote.start.isBefore(moment()) ? 'opacity: 0.5;' : ''
            }" class="ui-widget-content ui-datatable-even" role="row">
                <td role="gridcell" style="text-align: center;" class="notSign">
                    ${
                        leaveReceiptNote.status === '結案'
                            ? '<i style="color: darkgreen;" class="fa fa-1 fa-check-square-o"></i>'
                            : '<i style="color: chocolate;" class="fa fa-spinner fa-1 fa-spin fa-fw"></i>'
                    }
                </td>
                <td role="gridcell" style="text-align: center; font-size: 12px;" class="notSign">
                    ${leaveReceiptNote.type}
                </td>
                <td role="gridcell" style="text-align: center; font-size: 12px;">
                    ${leaveReceiptNote.start.format('YYYY/MM/DD (dd) HH:mm', { trim: false })}
                    ${leaveReceiptNote.end.format('YYYY/MM/DD (dd) HH:mm', { trim: false })}
                </td>
                <td role="gridcell" style="text-align: center;" class="notSign">
                    ${leaveReceiptNote.hours}
                </td>
                <td role="gridcell" style="text-align: center; font-size: 12px;" class="notSign">
                    ${leaveReceiptNote.status}
                </td>
                 <td role="gridcell" style="text-align: center; font-size: 12px;" class="notSign">
                    ${leaveReceiptNote.start.fromNow()}
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
        <table role="grid" style="width: 100%;">
          <thead id="formTemplate:anno-datatable_head">
            <tr role="row" style="border-bottom: 1px solid darkgray;">
            <th id="formTemplate:anno-datatable:j_idt707" role="columnheader" aria-label="" scope="col" style="text-align: center;width:8px">
                <span class="ui-column-title" style="margin-right: 2px;"></span>
              </th>
              <th id="formTemplate:anno-datatable:j_idt707" role="columnheader" aria-label="假別" scope="col" style="text-align: center;">
                <span class="ui-column-title" style="margin-right: 2px;">假別</span>
              </th>
              <th id="formTemplate:anno-datatable:j_idt710" role="columnheader" scope="col" style="text-align: center;width:130px">
                <span class="ui-column-title" style="margin-right: 2px;">時間</span>
              </th>
              <th id="formTemplate:anno-datatable:j_idt713" role="columnheader" aria-label="小時" scope="col" style="text-align: center;width:35px">
                <span class="ui-column-title" style="margin-right: 2px;">小時</span>
              </th>
              <th id="formTemplate:anno-datatable:j_idt715" role="columnheader" aria-label="狀態" scope="col" style="text-align: center;">
                <span class="ui-column-title" style="margin-right: 2px;">狀態</span>
              </th>
              <th id="formTemplate:anno-datatable:j_idt715" role="columnheader" aria-label="" scope="col" style="text-align: center;">
                <span class="ui-column-title" style="margin-right: 2px;"></span>
              </th>
            </tr>
          </thead>
          <tbody id="formTemplate:anno-datatable_data" class="ui-datatable-data ui-widget-content">
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
            ${isToday(attendance.signInDate) === true ? '<i class="fa fa-hand-o-right"></i>' : ''}
            <label id="formTemplate:attend_rec_datatable:0:j_idt760" class="ui-outputlabel ui-widget">
                ${attendance.signInDate.format('MM/DD', { trim: false })} (${formatWeekday(attendance.signInDate)})
            </label>
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
