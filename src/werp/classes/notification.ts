import * as moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { Moment } from '@/moment';
import { formatAttendance, getPredictedSignOutDate, getTodayAttendance } from '@/werp/classes/attendanceUtility';
import { formatTime } from '@/werp/classes/momentUtility';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { showNotification } from '@/common/notification';
import { log } from '@/common/logger';

export const showAttendanceNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signInDate, signOutDate }: Attendance = formatAttendance(todayAttendance);
    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(currentDate, 'minutes');
    const currentDateString: string = currentDate.format('YYYYMMDD', { trim: false });

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '已經簽退',
            {
                body: '請馬上離開辦公室',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION, currentDateString);
            }
        );
        return;
    }

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽到',
            {
                body: '尚未有簽到的紀錄',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );
        return;
    }

    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        if (SessionManager.getByKey(SessionKeys.OFF_WORK_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(SessionKeys.OFF_WORK_NOTIFICATION, currentDateString);
            }
        );
    }
    // 即將下班
    else if (predictedSignOutLeftMinutes < 30) {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `${predictedSignOutLeftMinutes > 0 ? `預計 ${predictedSignOutDate.fromNow()}下班` : '符合下班條件'}`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
            }
        );
    }
};
