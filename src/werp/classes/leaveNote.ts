import * as moment from 'moment';

import LeaveNote from '@/werp/interfaces/LeaveNote';
import { getLeaveNoteTemplate } from '@/werp/classes/template';
import { sleep } from '@/common/timer';
import { fetchPersonalLeaveNotes } from '@/werp/classes/ajax';
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
    if (document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(7) > td:nth-child(4)') !== null) {
        document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(7) > td:nth-child(4)').innerHTML =
            getLeaveNoteTemplate(leaveNotes[1]);
    } else {
        document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(5) > td:nth-child(4)').innerHTML =
            getLeaveNoteTemplate(leaveNotes[1]);
    }
    document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(4) > td:nth-child(4)').innerHTML =
        getLeaveNoteTemplate(leaveNotes[2]);
    document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(3) > td:nth-child(4)').innerHTML =
        getLeaveNoteTemplate(leaveNotes[3]);
    document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(2) > td:nth-child(4)').innerHTML =
        getLeaveNoteTemplate(leaveNotes[4]);
    document.querySelector('#formTemplate\\:attend_rec_datatable_data > tr:nth-child(1) > td:nth-child(4)').innerHTML =
        getLeaveNoteTemplate(leaveNotes[5]);
};

export const updateLeaveNote = async (): Promise<void> => {
    getUpdateLeaveNoteButton().className += ' fa-spin';
    await sleep(3);
    const leaveNotes: LeaveNote[] | null = await fetchPersonalLeaveNotes();
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES, JSON.stringify(leaveNotes));
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES_TIMESTAMP, String(moment().valueOf()));
    log('手動從伺服器取得請假/異常記錄');
    updateLeaveNoteView(leaveNotes);
    appendUpdateLeaveNoteFunction();
    getUpdateLeaveNoteButton().className = getUpdateLeaveNoteButton().className.replace(' fa-spin', '');
};
