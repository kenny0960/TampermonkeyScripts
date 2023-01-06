import * as moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { Moment } from '@/moment';
import { formatAttendance, getPredictedSignOutDate, getTodayAttendance } from '@/werp/classes/attendanceUtility';
import { formatTime } from '@/werp/classes/momentUtility';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { showNotification } from '@/common/notification';
import { log } from '@/common/logger';
import UpdateLog from '@/werp/interfaces/UpdateLog';

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

export const showUpdateLogNotification = (updateLog: UpdateLog): void => {
    if (SessionManager.getByKey(SessionKeys.UPDATE_LOG_NOTIFICATION) === updateLog.version) {
        return;
    }

    showNotification(
        `更新日誌 v${updateLog.version} (${moment(updateLog.date).fromNow()})`,
        {
            body: `${updateLog.messages.join('、')}...`,
            icon: 'data:image/png;base64,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',
        },
        () => {
            log(`已經關閉更新日誌通知`);
            SessionManager.setByKey(SessionKeys.UPDATE_LOG_NOTIFICATION, updateLog.version);
        }
    );

    // 顯示一次就好
    SessionManager.setByKey(SessionKeys.UPDATE_LOG_NOTIFICATION, updateLog.version);
};
