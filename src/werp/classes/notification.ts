import * as moment from 'moment';

import Attendance from '@/werp/interfaces/Attendance';
import { Moment } from '@/moment';
import { formatAttendance, getPredictedSignOutDate, getTodayAttendance } from '@/werp/classes/attendanceUtility';
import { formatTime } from '@/werp/classes/momentUtility';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { showNotification } from '@/common/notification';
import { log } from '@/common/logger';
import UpdateLog from '@/werp/interfaces/UpdateLog';
import {
    GOOD_BYE_IMAGE,
    NEW_VERSION_IMAGE,
    RING_BELL_IMAGE,
    STITCH_IN_PAINTING_IMAGE,
    WARNING_IMAGE,
} from '@/werp/consts/Base64Image';
import { sendAttendances } from '@/werp/classes/lineBot/messagingApi';
import { notify } from '@/common/lineBot/ajax';

export const showCompanyNotification = (): void => {
    const notificationElements: NodeListOf<HTMLTableRowElement> = document.querySelectorAll(
        '#formTemplate\\:dtAlert2_data > tr'
    );
    const notifications: string[] = [];

    if (notificationElements.length === 0 || notificationElements.item(0).innerText.trim() === '無最新消息資料') {
        return;
    }

    notificationElements.forEach((notificationElement: HTMLTableRowElement): void => {
        // 範本：'公告 (2023年 2月事業群聚餐)\n                \n                admin'
        notifications.push(notificationElement.innerText.split('\n')[0]);
    });

    showNotification(
        '公告',
        {
            body: `${notifications.join('、')}...`,
            icon: RING_BELL_IMAGE,
        },
        (): void => {
            const closeBtn: HTMLAnchorElement | null = document.querySelector('#news-top a.newClearButton');
            if (closeBtn === null) {
                return;
            }
            closeBtn.click();
        }
    );

    notify(`公告：${notifications.join('、')}...`);
};

export const showAttendanceNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const todayAttendance: Attendance = getTodayAttendance(attendances);
    const { signInDate, signOutDate }: Attendance = formatAttendance(todayAttendance);
    const predictedSignOutDate: Moment = getPredictedSignOutDate(attendances);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(currentDate, 'minutes');
    const currentDateString: string = currentDate.format('YYYYMMDD', { trim: false });

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '已經簽退',
            {
                body: '請馬上離開辦公室',
                icon: GOOD_BYE_IMAGE,
            },
            (): void => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_ALREADY_NOTIFICATION, currentDateString);
            }
        );

        sendAttendances(attendances);
        notify(`已經簽退：請馬上離開辦公室`);
        return;
    }

    // 未簽到：不再預測可簽退時間
    if (formatTime(todayAttendance.signInDate) === '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽到',
            {
                body: '尚未有簽到的紀錄',
                icon: WARNING_IMAGE,
            },
            (): void => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );

        notify(`記得簽到：尚未有簽到的紀錄`);
        return;
    }

    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        if (SessionManager.getByKey(SessionKeys.OFF_WORK_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`,
                icon: GOOD_BYE_IMAGE,
            },
            (): void => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(SessionKeys.OFF_WORK_NOTIFICATION, currentDateString);
            }
        );

        notify(`記得簽退：超時工作(+${Math.abs(todaySignOutLeftMinutes)})`);
    }
    // 即將下班
    else if (predictedSignOutLeftMinutes < 30) {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_NOTIFICATION) === currentDateString) {
            return;
        }

        if (predictedSignOutLeftMinutes > 0) {
            showNotification(
                '記得簽退',
                {
                    body: `預計 ${predictedSignOutDate.fromNow()}下班`,
                    icon: STITCH_IN_PAINTING_IMAGE,
                },
                (): void => {
                    log(`已經關閉簽退通知`);
                    SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
                }
            );

            notify(`記得簽退：預計 ${predictedSignOutDate.fromNow()}下班`);
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: '符合下班條件',
                icon: GOOD_BYE_IMAGE,
            },
            (): void => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
            }
        );

        notify(`記得簽退：符合下班條件`);
    }
};

export const showUpdateLogNotification = (updateLog: UpdateLog): void => {
    if (SessionManager.getByKey(SessionKeys.UPDATE_LOG_NOTIFICATION) === updateLog.version) {
        return;
    }

    showNotification(
        `更新日誌 v${updateLog.version} (${moment(updateLog.date).fromNow()})`,
        {
            body: `${updateLog.messages.join('、')}...`,
            icon: NEW_VERSION_IMAGE,
        },
        (): void => {
            log(`已經關閉更新日誌通知`);
            SessionManager.setByKey(SessionKeys.UPDATE_LOG_NOTIFICATION, updateLog.version);
        }
    );

    notify(`更新日誌 v${updateLog.version} (${moment(updateLog.date).fromNow()})：${updateLog.messages.join('、')}...`);
    // 顯示一次就好
    SessionManager.setByKey(SessionKeys.UPDATE_LOG_NOTIFICATION, updateLog.version);
};
