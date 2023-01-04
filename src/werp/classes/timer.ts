import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { updateAttendanceFavicon } from '@/werp/classes/favicon';
import { showSignInNotification } from '@/werp/classes/notification';
import { log } from '@/common/logger';
import { updateTodayAttendanceContent } from '@/werp';

export const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER)));
};

export const startAttendanceTimers = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        if (isToday(attendances[i].signInDate) === true) {
            updateTodayAttendanceContent(table, attendances);
            updateAttendanceFavicon(attendances);
            showSignInNotification(attendances);

            // 定時更新內容
            const todayAttendanceContentTimer: number = window.setTimeout((): void => {
                log('更新預設當日下班內容');
                updateTodayAttendanceContent(table, attendances);
            }, 60 * 1000);
            SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER, String(todayAttendanceContentTimer));

            // 定時更新內容
            const todayAttendanceFaviconTimer: number = window.setTimeout((): void => {
                log('更新預設當日下班 Favicon');
                updateAttendanceFavicon(attendances);
            }, 60 * 1000);
            SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER, String(todayAttendanceFaviconTimer));

            // 定時更新內容
            const signInNotificationTimer: number = window.setTimeout(
                (): void => showSignInNotification(attendances),
                5 * 60 * 1000
            );
            SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER, String(signInNotificationTimer));
        }
    }
};
