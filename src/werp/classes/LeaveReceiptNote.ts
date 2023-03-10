import * as moment from 'moment';

import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import { fetchLeaveReceiptNotes } from '@/werp/classes/ajax';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { log } from '@/common/logger';
import { getLeaveReceiptNotesTemplate } from '@/werp/classes/template';
import { sleep } from '@/common/timer';

export const getUpdateLeaveReceiptNoteButton = (): HTMLAnchorElement => {
    const anchorElement: HTMLAnchorElement | null = document.querySelector('#update-leave-receipt-note');
    if (anchorElement === null) {
        return document.createElement('a');
    }
    return anchorElement;
};

export const appendUpdateLeaveReceiptNoteFunction = (): void => {
    getUpdateLeaveReceiptNoteButton().onclick = updateLeaveReceiptNote;
};

export const updateLeaveReceiptNoteView = (leaveReceiptNotes: LeaveReceiptNote[]): void => {
    const viewElement: HTMLDivElement | null = document.querySelector('#leave-receipt-note-template') as HTMLDivElement;
    if (viewElement === null || leaveReceiptNotes.length === 0) {
        return;
    }
    viewElement.innerHTML = getLeaveReceiptNotesTemplate(leaveReceiptNotes);
};

export const updateLeaveReceiptNote = async (): Promise<void> => {
    getUpdateLeaveReceiptNoteButton().className += ' fa-spin';
    await sleep(3);
    const leaveReceiptNote: LeaveReceiptNote[] = await fetchLeaveReceiptNotes();
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES, JSON.stringify(leaveReceiptNote));
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES_TIMESTAMP, String(moment().valueOf()));
    log('手動從伺服器取得請假記錄');
    updateLeaveReceiptNoteView(leaveReceiptNote);
    appendUpdateLeaveReceiptNoteFunction();
    getUpdateLeaveReceiptNoteButton().className = getUpdateLeaveReceiptNoteButton().className.replace(' fa-spin', '');
};
