import * as moment from 'moment';

import LeaveNote from '@/werp/interfaces/LeaveNote';
import { getLeaveNoteTemplate } from '@/werp/classes/template';
import { sleep } from '@/common/timer';
import { fetchLeaveNotes } from '@/werp/classes/ajax';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { log } from '@/common/logger';

export const defaultLeaveNote: LeaveNote = {
    unusualNote: '',
    unsignedNote: '',
    receiptNote: '',
};

export const getUpdateLeaveNoteButton = (): HTMLAnchorElement => {
    const anchorElement: HTMLAnchorElement | null = document.querySelector('#update-leave-note');
    if (anchorElement === null) {
        return document.createElement('a');
    }
    return anchorElement;
};

export const appendUpdateLeaveNoteFunction = (): void => {
    getUpdateLeaveNoteButton().onclick = updateLeaveNote;
};

export const updateLeaveNoteView = (leaveNotes: LeaveNote[] | null): void => {
    document
        .querySelectorAll('#formTemplate\\:attend_rec_datatable > div > table > tbody > tr:not(.progress-bar-tr)')
        .forEach((tr: HTMLTableRowElement, index: number): void => {
            tr.querySelector('td:nth-child(4)').innerHTML = getLeaveNoteTemplate(leaveNotes[5 - index]);
        });
};

export const updateLeaveNote = async (): Promise<void> => {
    getUpdateLeaveNoteButton().className += ' fa-spin';
    await sleep(3);
    const leaveNotes: LeaveNote[] | null = await fetchLeaveNotes();
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES, JSON.stringify(leaveNotes));
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES_TIMESTAMP, String(moment().valueOf()));
    log('手動從伺服器取得請假/異常記錄');
    updateLeaveNoteView(leaveNotes);
    appendUpdateLeaveNoteFunction();
    getUpdateLeaveNoteButton().className = getUpdateLeaveNoteButton().className.replace(' fa-spin', '');
};
