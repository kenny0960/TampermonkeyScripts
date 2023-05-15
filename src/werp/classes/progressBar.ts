import moment from 'moment';

import ProgressBar from '@/werp/interfaces/ProgressBar';
import Attendance from '@/werp/interfaces/Attendance';
import {
    formatAttendance,
    getLeaveMinutes,
    getPredictedSignOutDate,
    getTodayAttendance,
} from '@/werp/classes/attendanceUtility';
import { formatTime } from '@/werp/classes/momentUtility';
import { Moment } from '@/moment';
import { getProgressBarTemplate } from '@/werp/classes/template';

export const defaultProgressBar: ProgressBar = {
    percentage: 0,
    leftBar: {
        text: '',
        class: '',
    },
    rightBar: {
        text: '',
        color: '',
    },
    textClass: '',
};

export const getPredictedProgressBar = (attendances: Attendance[]): string => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const attendance: Attendance = formatAttendance(todayAttendance);
    const { signInDate }: Attendance = attendance;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        return '';
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(attendance.signOutDate) !== '') {
        return '';
    }

    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const progressBar: ProgressBar = {
        ...defaultProgressBar,
        leftBar: {
            ...defaultProgressBar.leftBar,
            class: 'progress-bar progress-bar-striped progress-bar-animated',
        },
        rightBar: {
            ...defaultProgressBar.rightBar,
            text: formatTime(predictedSignOutDate),
        },
    };

    if (predictedSignOutLeftMinutes > 30) {
        // 確保所有文字都可以顯示，最小 20%
        progressBar.percentage = Math.max(
            Math.floor(100 - (predictedSignOutLeftMinutes / (540 - getLeaveMinutes(attendance))) * 100),
            20
        );
        progressBar.leftBar = {
            text: `預計 ${predictedSignOutDate.fromNow()}`,
            class: `${progressBar.leftBar.class} bg-secondary`,
        };
        progressBar.rightBar.color = 'black';
    } else if (predictedSignOutLeftMinutes > 0) {
        progressBar.percentage = Math.floor(100 - (predictedSignOutLeftMinutes / (540 - getLeaveMinutes(attendance))) * 100);
        progressBar.leftBar = {
            text: `預計 ${predictedSignOutLeftMinutes.toString()} 分鐘後`,
            class: `${progressBar.leftBar.class} bg-success`,
        };
        progressBar.rightBar.color = 'white';
    } else {
        progressBar.percentage = 100;
        progressBar.leftBar = {
            text: '符合下班條件',
            class: `${progressBar.leftBar.class} bg-warning`,
        };
        progressBar.rightBar.color = 'white';
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        progressBar.percentage = 100;
        progressBar.leftBar = {
            text: '超時工作',
            class: `${progressBar.leftBar.class} bg-danger`,
        };
        progressBar.rightBar.color = 'white';
    }

    return getProgressBarTemplate(progressBar);
};

export const updatePredictedSignOutProgressBar = (
    tableSectionElement: HTMLTableSectionElement,
    attendances: Attendance[]
): void => {
    const progressBarElement: HTMLDivElement | null = tableSectionElement.parentElement.querySelector(
        '#predicted-sign-out-progress-bar'
    );
    if (progressBarElement === null) {
        return;
    }
    progressBarElement.innerHTML = getPredictedProgressBar(attendances);
};
