import Attendance from '@/werp/interfaces/Attendance';
import { formatTime, formatWeekday, isToday } from '@/werp/classes/momentUtility';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import LeaveNote from '@/werp/interfaces/LeaveNote';

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
    return `
        <td role="gridcell" style="text-align: center;">
            ${formatTime(attendance.signInDate)}
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
