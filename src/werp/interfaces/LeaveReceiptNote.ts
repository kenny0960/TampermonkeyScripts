import { Moment } from '@/moment';

interface LeaveReceiptNote {
    type: string;
    note: string;
    start: Moment;
    end: Moment;
    hours: number;
    status: string;
}

export default LeaveReceiptNote;
