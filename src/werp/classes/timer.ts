import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import Attendance from '@/werp/interfaces/Attendance';
import { isToday } from '@/werp/classes/momentUtility';
import { updateAttendanceFavicon } from '@/werp/classes/favicon';
import { showAttendanceNotification, showUpdateLogNotification } from '@/werp/classes/notification';
import { log } from '@/common/logger';
import { updatePredictedSignOutProgressBar } from '@/werp';
import UPDATE_LOGS from '@/werp/consts/UpdateLogs';

export const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.ATTENDANCE_TIMER)));
};

export const startAttendanceTimers = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        if (isToday(attendances[i].signInDate) === true) {
            updatePredictedSignOutProgressBar(table, attendances);
            updateAttendanceFavicon(attendances);
            showUpdateLogNotification(UPDATE_LOGS.slice(0, 1)[0]);
            showAttendanceNotification(attendances);

            // 定時更新內容
            const attendanceTimer: number = window.setTimeout((): void => {
                log('更新資訊');
                startAttendanceTimers(table, attendances);
            }, 60 * 1000);
            SessionManager.setByKey(SessionKeys.ATTENDANCE_TIMER, String(attendanceTimer));
        }
    }
};