import Attendance from '@/werp/interfaces/Attendance';
import { Moment } from '@/moment';
import * as moment from 'moment';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import { defaultLeaveNote } from '@/werp/classes/leaveNote';

export const getWeekAttendances = (firstDayAttendance: Attendance, leaveNotes: LeaveNote[]): Attendance[] => {
    const attendances: Attendance[] = [];
    for (let i = 1; i < 6; i++) {
        const initialDate: Moment = moment(firstDayAttendance.signInDate.day(i).format('YYYY/MM/DD 00:00', { trim: false }));
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
