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

export const formatDatetime = (moment: Moment): string => {
    return moment.format('YYYY/MM/DD HH:mm', { trim: false });
};

export const isToday = (targetMoment: Moment): boolean => {
    return moment().isSame(targetMoment.format('YYYY/MM/DD', { trim: false }), 'day') === true;
};

export const getToday = (): Moment => {
    // TODO 透過畫面去取的當天
    return moment();
};

export const formatEarliestSignInDate = (signInDate: Moment): Moment => {
    const signInDateString: string = signInDate.format('YYYY/MM/DD', { trim: false });
    // 打卡最早只能計算到 08:00
    if (signInDate.isBefore(moment(`${signInDateString} 08:00`))) {
        return moment(`${signInDateString} 08:00`);
    }
    // 如果打卡時間介於午休時間只能從 13:30 開始計算
    if (signInDate.isBetween(moment(`${signInDateString} 12:30`), moment(`${signInDateString} 13:30`))) {
        return moment(`${signInDateString} 13:30`);
    }
    return signInDate;
};

export const formatEarliestSignOutDate = (signOutDate: Moment): Moment => {
    const signOutDateString: string = signOutDate.format('YYYY/MM/DD', { trim: false });
    const earliestSignOutDate: Moment = moment(`${signOutDateString} 17:00`);
    if (signOutDate.isBefore(earliestSignOutDate)) {
        return earliestSignOutDate;
    }
    return signOutDate;
};
