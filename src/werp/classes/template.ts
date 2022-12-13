import Attendance from '@/werp/interfaces/Attendance';
import { formatTime, formatWeekday, isToday } from '@/werp/classes/momentUtility';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';

export const getAnnualLeaveTemplate = (annualLeave: AnnualLeave): string => {
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

export const getLeaveNoteTemplate = (leaveNote: string): string => {
    return `
        <td role="gridcell" style="text-align: center;">
            ${leaveNote}
        </td>
    `;
};
