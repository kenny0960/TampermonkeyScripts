import { Moment } from '@/moment';
import LeaveNote from '@/werp/interfaces/LeaveNote';

interface Attendance {
    signInDate: Moment;
    signOutDate: Moment;
    leaveNote: LeaveNote;
}

export default Attendance;
