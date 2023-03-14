import { Moment } from '@/moment';

interface LeaveReceiptNote {
    id: string;
    type: string;
    note: string;
    start: Moment;
    end: Moment;
    hours: number;
    status: string;
    isCanceled: boolean;
}

export default LeaveReceiptNote;
