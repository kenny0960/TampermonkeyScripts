import moment from 'moment';

import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import { getAnnualLeave, getLeaveNotes, getLeaveReceiptNotes } from '@/werp/classes/sessionManager';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';

import LeaveNote from '@/werp/interfaces/LeaveNote';
import Attendance from '@/werp/interfaces/Attendance';
import {
    getAnnouncementFlexBubble,
    getAnnualLeaveFlexBubble,
    getAttendancesFlexBubble,
    getLeaveNotesFlexCarousel,
    getLeaveReceiptNotesFlexCarousel,
} from '@/werp/classes/lineBot/flexMessageTemplate';
import { log } from '@/common/logger';
import Announcement from '@/werp/interfaces/Announcement';
import { sendMessages } from '@/common/lineBot/ajax';
import html2canvas from 'html2canvas';
import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';

export const getLinBotLeaveReceiptNotes = async (): Promise<LeaveReceiptNote[]> => {
    const leaveReceiptNotes: LeaveReceiptNote[] = [];
    for (const leaveReceiptNote of await getLeaveReceiptNotes()) {
        // 不顯示「過往已結案」
        if (leaveReceiptNote.status === '結案' && moment(leaveReceiptNote.start).isBefore(moment()) === true) {
            continue;
        }
        // 不顯示「已銷假」
        if (leaveReceiptNote.isCanceled === true) {
            continue;
        }
        leaveReceiptNotes.push(leaveReceiptNote);
    }
    return leaveReceiptNotes.reverse();
};

export const getLinBotLeaveNotes = async (): Promise<LeaveNote[]> => {
    const leaveNotes: LeaveNote[] = [];
    for (const leaveNote of await getLeaveNotes()) {
        if (leaveNote === null) {
            continue;
        }
        if (leaveNote.unusualNote === '' && leaveNote.unsignedNote === '') {
            continue;
        }
        leaveNotes.push(leaveNote);
    }
    return leaveNotes;
};

export const sendLeaveReceiptNotes = async (): Promise<void> => {
    const leaveReceiptNotes: LeaveReceiptNote[] = await getLinBotLeaveReceiptNotes();

    if (leaveReceiptNotes.length === 0) {
        log('近期沒有請假單可以傳送');
        return;
    }

    sendMessages([
        {
            type: 'flex',
            altText: `近期您有 ${leaveReceiptNotes.length} 則請假單`,
            contents: getLeaveReceiptNotesFlexCarousel(leaveReceiptNotes),
        },
    ]);
};

export const sendLeaveNotes = async (): Promise<void> => {
    const leaveNotes: LeaveNote[] = await getLinBotLeaveNotes();

    if (leaveNotes.length === 0) {
        log('近期沒有考勤異常可以傳送');
        return;
    }

    sendMessages([
        {
            type: 'flex',
            altText: `近期您有 ${leaveNotes.length} 則考勤異常`,
            contents: getLeaveNotesFlexCarousel(leaveNotes),
        },
    ]);
};

export const sendAnnualLeave = async (): Promise<void> => {
    const annualLeave: AnnualLeave = await getAnnualLeave();
    sendMessages([
        {
            type: 'flex',
            altText: `特休狀況`,
            contents: getAnnualLeaveFlexBubble(annualLeave),
        },
    ]);
};

export const sendAttendances = (attendances: Attendance[]): void => {
    sendMessages([
        {
            type: 'flex',
            altText: `當週出缺勤狀況`,
            contents: getAttendancesFlexBubble(attendances),
        },
    ]);
};

export const sendAttendancesScreenshot = async (): Promise<void> => {
    const attendancesElement: HTMLDivElement | null = document.querySelector('#formTemplate\\:attend_rec_datatable');
    const canvasElement: HTMLCanvasElement = await html2canvas(attendancesElement);
    await sendCanvasElementScreenshot(canvasElement, '當週出缺勤狀況');
};

export const sendCompanyEmployeeCountChart = async (): Promise<void> => {
    const canvasElement: HTMLCanvasElement = document.querySelector('#company_employee_count');
    await sendCanvasElementScreenshot(canvasElement, '公司在職人數');
};

export const sendAnnouncement = async (announcement: Announcement): Promise<void> => {
    sendMessages([
        {
            type: 'flex',
            altText: `公告：${announcement.subject}`,
            contents: getAnnouncementFlexBubble(announcement),
        },
    ]);
};
