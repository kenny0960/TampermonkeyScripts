import Attendance from '@/werp/interfaces/Attendance';
import { Moment } from '@/moment';
import * as moment from 'moment';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import { defaultLeaveNote } from '@/werp/classes/leaveNote';
import { formatEarliestSignInDate, formatEarliestSignOutDate, getPickedDate } from '@/werp/classes/momentUtility';

export const getWeekAttendances = (leaveNotes: LeaveNote[]): Attendance[] => {
    const pickedDate: Moment = getPickedDate();
    const attendances: Attendance[] = [];
    for (let i = 1; i < 6; i++) {
        const initialDate: Moment = moment(pickedDate.day(i).format('YYYY/MM/DD 00:00', { trim: false }));
        attendances[i] = {
            signInDate: initialDate,
            signOutDate: initialDate,
            leaveNote: leaveNotes[i] === undefined ? defaultLeaveNote : leaveNotes[i],
        };
    }
    return attendances;
};

export const getTodayAttendance = (attendances: Attendance[]): Attendance => {
    return attendances[moment().day()];
};

export const formatAttendance = (attendance: Attendance): Attendance => {
    return {
        ...attendance,
        signInDate: formatEarliestSignInDate(attendance.signInDate),
    };
};

export const getTotalRemainMinutes = (attendances: Attendance[]): number => {
    let remainMinutes: number = 0;
    for (let i = 1; i < attendances.length; i++) {
        // 國定假日或請假直接不計算
        if (getWorkingMinutes(attendances[i]) === 0) {
            continue;
        }
        remainMinutes += getRemainMinutes(attendances[i]);
    }
    return remainMinutes;
};

export const getWorkingMinutes = ({ signOutDate, signInDate }: Attendance): number => {
    return signOutDate.diff(signInDate, 'minutes');
};

export const isNoBackLeaveNote = (leaveNote: LeaveNote): boolean => {
    return leaveNote.receiptNote.includes('1800');
};

export const getLeaveMinutes = ({ signInDate, leaveNote }: Attendance): number => {
    const matches: RegExpMatchArray | null = leaveNote.receiptNote.match(/^(?<leaveTime>\d+)-(?<backTime>\d+).+$/);

    if (matches === null || matches.length === 0) {
        return 0;
    }

    const { leaveTime, backTime } = matches.groups;
    const date: string = signInDate.format('YYYY/MM/DD', { trim: false });
    const leaveDate: Moment = moment(`${date} ${leaveTime.slice(0, 2)}:${leaveTime.slice(2, 4)}`);
    const backDate: Moment = moment(`${date} ${backTime.slice(0, 2)}:${backTime.slice(2, 4)}`);

    // 上班途中請假不算累積分鐘
    if (isNoBackLeaveNote(leaveNote) === false && signInDate.isBefore(leaveDate)) {
        return 0;
    }

    return backDate.diff(leaveDate, 'minutes');
};

export const getRemainMinutes = (attendance: Attendance): number => {
    return getWorkingMinutes(formatAttendance(attendance)) + getLeaveMinutes(attendance) - 9 * 60;
};

export const getPredictedSignOutDate = (attendances: Attendance[]): Moment => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signOutDate, leaveNote }: Attendance = formatAttendance(todayAttendance);
    const predictedSignOutDate: Moment = signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes');
    // 請假到下班，無需校正
    if (isNoBackLeaveNote(leaveNote) === true) {
        return predictedSignOutDate;
    }
    return formatEarliestSignOutDate(predictedSignOutDate);
};
