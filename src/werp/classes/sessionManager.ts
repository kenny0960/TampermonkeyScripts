import * as moment from 'moment';

import LeaveNote from '@/werp/interfaces/LeaveNote';
import { log } from '@/common/logger';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import Attendance from '@/werp/interfaces/Attendance';
import {
    fetchAllCompanyEmployeeCount,
    fetchAnnualLeave,
    fetchPersonalLeaveNotes,
    fetchPersonalLeaveReceiptNotes,
} from '@/werp/classes/ajax';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';

export const isValidTimestamp = (sessionKey: SessionKeys, timeoutSeconds: number): boolean => {
    const timestamp: string = SessionManager.getByKey(sessionKey);
    if (timestamp === '') {
        return false;
    }
    return moment().valueOf() - Number(timestamp) < timeoutSeconds * 1000;
};

export const getLeaveNotes = async (attendance: Attendance): Promise<LeaveNote[]> => {
    if (isValidTimestamp(SessionKeys.AJAX_LEAVE_NOTES_TIMESTAMP, 4 * 60 * 60) === true) {
        log('從本地取得請假/異常記錄');
        return SessionManager.getArrayByKey(SessionKeys.AJAX_LEAVE_NOTES);
    }
    const leaveNotes: LeaveNote[] = await fetchPersonalLeaveNotes(attendance);
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES, JSON.stringify(leaveNotes));
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_NOTES_TIMESTAMP, String(moment().valueOf()));
    log('從伺服器取得請假/異常記錄');
    return leaveNotes;
};

export const getAnnualLeave = async (): Promise<AnnualLeave | null> => {
    if (isValidTimestamp(SessionKeys.AJAX_ANNUAL_LEAVE_TIMESTAMP, 8 * 60 * 60) === true) {
        log('從本地取得特休記錄');
        return SessionManager.getObjectByKey(SessionKeys.AJAX_ANNUAL_LEAVE) as AnnualLeave;
    }
    const annualLeave: AnnualLeave | null = await fetchAnnualLeave();
    SessionManager.setByKey(SessionKeys.AJAX_ANNUAL_LEAVE, JSON.stringify(annualLeave));
    SessionManager.setByKey(SessionKeys.AJAX_ANNUAL_LEAVE_TIMESTAMP, String(moment().valueOf()));
    log('從伺服器取得特休記錄');
    return annualLeave;
};

export const getLeaveReceiptNotes = async (): Promise<LeaveReceiptNote[]> => {
    if (isValidTimestamp(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES_TIMESTAMP, 4 * 60 * 60) === true) {
        log('從本地取得請假記錄');
        return SessionManager.getArrayByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES);
    }
    const leaveReceiptNotes: LeaveReceiptNote[] = await fetchPersonalLeaveReceiptNotes();
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES, JSON.stringify(leaveReceiptNotes));
    SessionManager.setByKey(SessionKeys.AJAX_LEAVE_RECEIPT_NOTES_TIMESTAMP, String(moment().valueOf()));
    log('從伺服器取得請假記錄');
    return leaveReceiptNotes;
};

export const getCompanyEmployeeCountObject = async (): Promise<Object | null> => {
    if (isValidTimestamp(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT_TIMESTAMP, 8 * 60 * 60) === true) {
        log('從本地取得公司職員狀況');
        return SessionManager.getObjectByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT);
    }
    const companyEmployeeCount: number | null = await fetchAllCompanyEmployeeCount();
    SessionManager.setByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT_TIMESTAMP, String(moment().valueOf()));

    if (companyEmployeeCount === null) {
        return;
    }
    const year: number = moment().year();
    const week: number = moment().week();
    const companyEmployeeCountObject: Object = SessionManager.getObjectByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT);
    companyEmployeeCountObject[year] = {
        ...companyEmployeeCountObject[year],
        [week]: companyEmployeeCount,
    };
    SessionManager.setByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT, JSON.stringify(companyEmployeeCountObject));
    log('從伺服器取得公司職員狀況');
    return companyEmployeeCountObject;
};
