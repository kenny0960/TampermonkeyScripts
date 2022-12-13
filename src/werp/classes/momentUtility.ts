import { Moment } from '@/moment';
import * as moment from 'moment';

export const formatWeekday = (moment: Moment): string => {
    switch (moment.day()) {
        case 1:
            return '一';
        case 2:
            return '二';
        case 3:
            return '三';
        case 4:
            return '四';
        case 5:
            return '五';
        case 6:
            return '六';
        case 7:
            return '日';
    }
    return '';
};

export const formatTime = (moment: Moment): string => {
    const time: string = moment.format('HH:mm', { trim: false });
    if (time === '00:00') {
        return '';
    }
    return time;
};

export const isToday = (targetMoment: Moment): boolean => {
    return moment().day() === targetMoment.day();
};
