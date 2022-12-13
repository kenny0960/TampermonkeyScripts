import { Moment } from '@/moment';

interface Attendance {
    signInDate: Moment;
    signOutDate: Moment;
    leaveNote: string;
}

export default Attendance;
