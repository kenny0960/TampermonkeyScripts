import moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { formatAttendance, getPredictedSignOutDate, getTodayAttendance } from '@/werp/classes/attendanceUtility';
import { Moment } from '@/moment';
import { formatTime } from '@/werp/classes/momentUtility';
import { insertFaviconHTML } from '@/common/favicon';

export const initializeFaviconBadge = (): void => {
    document.querySelectorAll('favicon-badge').forEach((faviconBadge: FavIconBadge) => {
        faviconBadge.remove();
    });
    document.querySelectorAll('link[rel="shortcut icon"]').forEach((linkElement: HTMLLinkElement) => {
        linkElement.remove();
    });
    insertFaviconHTML(`<favicon-badge src="" />`);
};

export const updateAttendanceFavicon = (attendances: Attendance[]) => {
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signOutDate, signInDate }: Attendance = formatAttendance(todayAttendance);
    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const faviconBadge: FavIconBadge = document.querySelector('favicon-badge');
    faviconBadge.textColor = 'white';
    faviconBadge.badgeSize = 16;

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        document.title = '未簽到';
        faviconBadge.badgeColor = '#cc0000';
        faviconBadge.badge = '未';
        return;
    }

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        document.title = '已經簽退';
        faviconBadge.badgeColor = '#3399ff';
        faviconBadge.badge = '離';
        return;
    }

    if (predictedSignOutLeftMinutes > 30) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#737373';
        faviconBadge.badge = `${predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1]}H`;
    } else if (predictedSignOutLeftMinutes > 0) {
        document.title = `預計 ${predictedSignOutLeftMinutes.toString()} 分鐘後`;
        faviconBadge.badgeColor = '#006600';
        faviconBadge.badge = predictedSignOutLeftMinutes.toString();
    } else {
        document.title = '符合下班條件';
        faviconBadge.badgeColor = '#e69500';
        faviconBadge.badge = '可';
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        document.title = `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`;
        faviconBadge.badgeColor = '#cc0000';
        faviconBadge.badge = '超';
    }
};
