import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { updateAttendanceFavicon } from '@/werp/classes/favicon';
import { showSignInNotification } from '@/werp/classes/notification';
import { log } from '@/common/logger';
import { updateTodayAttendanceContent } from '@/werp';

export const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.ATTENDANCE_TIMER)));
};

export const startAttendanceTimers = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        if (isToday(attendances[i].signInDate) === true) {
            updateTodayAttendanceContent(table, attendances);
            updateAttendanceFavicon(attendances);
            showSignInNotification(attendances);

            // 定時更新內容
            const attendanceTimer: number = window.setTimeout((): void => {
                log('更新資訊');
                startAttendanceTimers(table, attendances);
            }, 60 * 1000);
            SessionManager.setByKey(SessionKeys.ATTENDANCE_TIMER, String(attendanceTimer));
        }
    }
};
