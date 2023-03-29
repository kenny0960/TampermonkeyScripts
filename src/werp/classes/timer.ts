import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { updateAttendanceFavicon } from '@/werp/classes/favicon';
import { showAttendanceNotification, showCompanyNotification, showUpdateLogNotification } from '@/werp/classes/notification';
import { log } from '@/common/logger';
import UPDATE_LOGS from '@/werp/consts/UpdateLogs';
import { updatePredictedSignOutProgressBar } from '@/werp/classes/progressBar';
import { updatePredictedSignOutTemplate, updateAttendanceSummary } from '@/werp/classes/attendanceTable';
import { TIMER_ATTENDANCE_SECONDS, TIMER_NOTIFICATION_MINUTES } from '@/werp/consts/env';

export const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.ATTENDANCE_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.NOTIFICATION_TIMER)));
};

export const startAttendanceTimer = (tableSectionElement: HTMLTableSectionElement, attendances: Attendance[]) => {
    updatePredictedSignOutTemplate(attendances);
    updatePredictedSignOutProgressBar(tableSectionElement, attendances);
    updateAttendanceSummary(attendances);
    updateAttendanceFavicon(attendances);
    // 定時更新內容
    const attendanceTimer: number = window.setTimeout((): void => {
        log('更新資訊');
        startAttendanceTimer(tableSectionElement, attendances);
    }, TIMER_ATTENDANCE_SECONDS * 1000);
    SessionManager.setByKey(SessionKeys.ATTENDANCE_TIMER, String(attendanceTimer));
};

export const startNotificationTimer = (attendances: Attendance[]) => {
    showUpdateLogNotification(UPDATE_LOGS.slice(0, 1)[0]);
    showAttendanceNotification(attendances);
    showCompanyNotification();

    // 定時更新內容
    const notificationTimer: number = window.setTimeout((): void => {
        log('顯示通知');
        startNotificationTimer(attendances);
    }, TIMER_NOTIFICATION_MINUTES * 60 * 1000);
    SessionManager.setByKey(SessionKeys.NOTIFICATION_TIMER, String(notificationTimer));
};

export const startAttendanceTimers = (tableSectionElement: HTMLTableSectionElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        if (isToday(attendances[i].signInDate) === true) {
            startAttendanceTimer(tableSectionElement, attendances);
            startNotificationTimer(attendances);
        }
    }
};
