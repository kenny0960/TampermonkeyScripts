import * as moment from 'moment';

import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import { fetchAnnualLeave } from '@/werp/classes/ajax';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { log } from '@/common/logger';
import { getAnnualLeaveTemplate } from '@/werp/classes/template';
import { sleep } from '@/common/timer';
import { sendAnnualLeave } from '@/werp/classes/lineBot/messagingApi';

export const getUpdateAnnualLeaveButton = (): HTMLAnchorElement => {
    const anchorElement: HTMLAnchorElement | null = document.querySelector('#update-annual-leave');
    if (anchorElement === null) {
        return document.createElement('a');
    }
    return anchorElement;
};

export const getSendAnnualLeaveButton = (): HTMLAnchorElement => {
    const anchorElement: HTMLAnchorElement | null = document.querySelector('#send-annual-leave');
    if (anchorElement === null) {
        return document.createElement('a');
    }
    return anchorElement;
};

export const appendUpdateAnnualLeaveFunction = (): void => {
    getUpdateAnnualLeaveButton().onclick = updateAnnualLeave;
    getSendAnnualLeaveButton().onclick = sendAnnualLeave;
};

export const updateAnnualLeaveView = (annualLeave: AnnualLeave | null): void => {
    const viewElement: HTMLDivElement | null = document.querySelector('#annual-leave-template') as HTMLDivElement;
    if (viewElement === null || annualLeave === null) {
        return;
    }
    viewElement.innerHTML = getAnnualLeaveTemplate(annualLeave);
};

export const updateAnnualLeave = async (): Promise<void> => {
    getUpdateAnnualLeaveButton().className += ' fa-spin';
    await sleep(1);
    const annualLeave: AnnualLeave | null = await fetchAnnualLeave();
    SessionManager.setByKey(SessionKeys.AJAX_ANNUAL_LEAVE, JSON.stringify(annualLeave));
    SessionManager.setByKey(SessionKeys.AJAX_ANNUAL_LEAVE_TIMESTAMP, String(moment().valueOf()));
    log('手動從伺服器取得特休記錄');
    updateAnnualLeaveView(annualLeave);
    appendUpdateAnnualLeaveFunction();
    getUpdateAnnualLeaveButton().className = getUpdateAnnualLeaveButton().className.replace(' fa-spin', '');
};
