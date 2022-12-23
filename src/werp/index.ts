import * as moment from 'moment';
import 'favIcon-badge';

import { log } from '@/common/logger';
import { insertFaviconHTML } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import SessionManager from '@/common/SessionManager';
import { Moment } from '@/moment';
import * as PackageJson from '@/../package.json';
import Attendance from '@/werp/interfaces/Attendance';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import SessionKeys from '@/werp/enums/SessionKeys';
import { getTodayAttendance, getWeekAttendances } from '@/werp/classes/attendanceUtility';
import { formatTime, isToday } from '@/werp/classes/momentUtility';
import {
    getAnnualLeaveTemplate,
    getAttendanceDateTemplate,
    getAttendanceSignInTemplate,
    getAttendanceSignOutTemplate,
    getLeaveNoteTemplate,
} from '@/werp/classes/template';

const fetchAnnualLeaveToken = async (): Promise<string | null> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
        },
        referrer: 'https://cy.iwerp.net/portal/page/new_home.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            const inputElement: HTMLInputElement | null = html.querySelector('input[id="j_id1:javax.faces.ViewState:0"]');
            if (inputElement === null) {
                return null;
            }
            return encodeURIComponent(inputElement.value.trim());
        });
};

const fetchAnnualLeave = async (): Promise<AnnualLeave | null> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F11%2F26&j_idt158_input=2022%2F12%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=${await fetchAnnualLeaveToken()}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            const labels: NodeListOf<HTMLLabelElement> = html.querySelectorAll('#annual-now-year li label:nth-child(2)');
            if (labels.length === 0) {
                return null;
            }
            return {
                totalHours: parseInt(labels.item(0).innerText),
                leaveHours: parseInt(labels.item(1).innerText),
                notLeaveHours: parseInt(labels.item(2).innerText),
                startDatetime: labels.item(3).innerText,
                endDatetime: labels.item(4).innerText,
            };
        });
};

const fetchPersonalLeaveNotesToken = async (): Promise<string | null> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/merge/personal.xhtml', {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
        },
        referrer: 'https://cy.iwerp.net/portal/page/new_home.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            const inputElement: HTMLInputElement | null = html.querySelector('input[id="j_id1:javax.faces.ViewState:0"]');
            if (inputElement === null) {
                return null;
            }
            return encodeURIComponent(inputElement.value.trim());
        });
};

const fetchPersonalLeaveNotesSearchPattern = async (): Promise<string[]> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/merge/personal.xhtml', {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
        },
        referrer: 'https://cy.iwerp.net/portal/page/new_home.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            const inputElements: NodeListOf<HTMLInputElement> = html.querySelectorAll('#searchContent input');
            if (inputElements.length < 2) {
                return [];
            }
            return [inputElements.item(0).name, inputElements.item(1).name];
        });
};

const fetchPersonalLeaveNotes = async (): Promise<string[]> => {
    const searchPattern: string[] = await fetchPersonalLeaveNotesSearchPattern();
    const attendances: Attendance[] = getWeekAttendances([]);
    const endDate: string = attendances[5].signInDate.format('YYYY/MM/DD', { trim: false });
    const startDate: string = attendances[1].signInDate.format('YYYY/MM/DD', { trim: false });
    const searchDateRange: string = `&${searchPattern[0]}=${startDate}&${searchPattern[1]}=${endDate}`;

    return fetch('https://cy.iwerp.net/hr-attendance/merge/personal.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/merge/personal.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt152_input=2022%2F11%2F26&j_idt156_input=2022%2F12%2F25&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=${await fetchPersonalLeaveNotesToken()}`.replace(
            /&j_idt152_input=\d+%2F\d+%2F\d+&j_idt156_input=\d+%2F\d+%2F\d+/,
            searchDateRange
        ),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const leaveNotes: string[] = [];
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            html.querySelectorAll('.ui-datatable-frozenlayout-right tbody tr').forEach(
                (tr: HTMLTableRowElement, index: number) => {
                    const leaveNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(3);
                    const unusualNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(2);
                    if (leaveNoteElement !== null && unusualNoteElement !== null) {
                        leaveNotes[index + 1] = leaveNoteElement.innerText.trim() || unusualNoteElement.innerText.trim();
                    }
                }
            );
            return leaveNotes;
        });
};

const showSignInNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const { signInDate, signOutDate }: Attendance = formatAttendance(getTodayAttendance(attendances));
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const todaySignInContent: string = formatTime(signInDate);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(currentDate, 'minutes');
    const currentDateString: string = currentDate.format('YYYYMMDD', { trim: false });

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        showNotification(
            '已經簽退',
            {
                body: '請馬上離開辦公室',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );
        return;
    }

    if (todaySignInContent === '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽到',
            {
                body: '尚未有簽到的紀錄',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );
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
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(SessionKeys.OFF_WORK_NOTIFICATION, currentDateString);
            }
        );
    }
    // 即將下班
    else if (predictedSignOutLeftMinutes < 30) {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `${predictedSignOutLeftMinutes > 0 ? `預計 ${predictedSignOutDate.fromNow()}下班` : '符合下班條件'}`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
            }
        );
    }

    const signInNotificationTimer: number = window.setTimeout(
        (): void => showSignInNotification(attendances),
        5 * 60 * 1000
    );
    SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER, String(signInNotificationTimer));
};

const formatEarliestSignInDate = (signInDate: Moment): Moment => {
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

const formatEarliestSignOutDate = (signOutDate: Moment): Moment => {
    const signOutDateString: string = signOutDate.format('YYYY/MM/DD', { trim: false });
    const earliestSignOutDate: Moment = moment(`${signOutDateString} 17:00`);
    if (signOutDate.isBefore(earliestSignOutDate)) {
        return earliestSignOutDate;
    }
    return signOutDate;
};

const formatAttendance = (attendance: Attendance): Attendance => {
    return {
        ...attendance,
        signInDate: formatEarliestSignInDate(attendance.signInDate),
    };
};

const getTotalRemainMinutes = (attendances: Attendance[]): number => {
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

const getWorkingMinutes = ({ signOutDate, signInDate }: Attendance): number => {
    return signOutDate.diff(signInDate, 'minutes');
};

const getLeaveMinutes = ({ signInDate, leaveNote }: Attendance): number => {
    const matches: RegExpMatchArray | null = leaveNote.match(/(?<leaveTime>\d+)-(?<backTime>\d+).+/);

    if (matches === null || matches.length === 0) {
        return 0;
    }

    const { leaveTime, backTime } = matches.groups;
    const date: string = signInDate.format('YYYY/MM/DD', { trim: false });
    const leaveDate: Moment = moment(`${date} ${leaveTime.slice(0, 2)}:${leaveTime.slice(2, 4)}`);
    const backDate: Moment = moment(`${date} ${backTime.slice(0, 2)}:${backTime.slice(2, 4)}`);

    // 上班途中請假不算累積分鐘
    if (signInDate.isBefore(leaveDate)) {
        return 0;
    }

    return backDate.diff(leaveDate, 'minutes');
};

const getRemainMinutes = (attendance: Attendance): number => {
    return getWorkingMinutes(formatAttendance(attendance)) + getLeaveMinutes(attendance) - 9 * 60;
};

const getAttendanceByTr = (tr: HTMLTableRowElement): Attendance => {
    const currentDate: Moment = moment();
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings: string[] = tr.innerText.split('\t');
    const dateString: string = `${currentDate.year()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate: Moment = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate: Moment = moment(`${dateString} ${datetimeStrings[2]}`);
    return {
        signInDate,
        signOutDate,
        leaveNote: '',
    };
};

const getAttendanceByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, leaveNotes: string[]): Attendance[] => {
    const attendances: Attendance[] = getWeekAttendances(leaveNotes);

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const attendance: Attendance = getAttendanceByTr(tr);

        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        attendances[attendance.signOutDate.day()] = {
            ...attendances[attendance.signOutDate.day()],
            signInDate: attendance.signInDate,
            signOutDate: attendance.signOutDate,
        };
    }

    return attendances;
};

const updateTodayAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]): void => {
    const index: number = 5 - moment().day();
    const todayAttendanceContentElement: HTMLTableRowElement = table.getElementsByTagName('tr').item(index);
    const todayAttendanceSignOutElement: HTMLTableCellElement = todayAttendanceContentElement
        .getElementsByTagName('td')
        .item(2);
    todayAttendanceSignOutElement.innerHTML = getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));

    // 定時更新內容
    const todayAttendanceContentTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班內容');
        updateTodayAttendanceContent(table, attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER, String(todayAttendanceContentTimer));
};

const getTodayAttendanceInnerHTML = (attendances: Attendance[]): string => {
    const attendance: Attendance = formatAttendance(getTodayAttendance(attendances));
    const { signOutDate, signInDate }: Attendance = attendance;

    // 已簽退：不再預測可簽退時間
    if (formatTime(attendance.signOutDate) !== '') {
        return getPastDayAttendanceInnerHTML(attendance);
    }

    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutTimeString: string = formatTime(predictedSignOutDate);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');

    let innerHTML: string = `<div style="font-size: 20px;"> ${predictedSignOutTimeString} </div>`;
    if (predictedSignOutLeftMinutes > 0) {
        innerHTML += `<div style="font-size: 12px;"> 預計 ${predictedSignOutDate.fromNow()} </div>`;
    } else {
        innerHTML += `<div style="font-size: 12px;"> 符合下班條件 </div>`;
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        innerHTML = `<div style="font-size: 12px;"> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+${Math.abs(
            todaySignOutLeftMinutes
        )})</span></div>`;
    }
    return innerHTML;
};

const getPastDayAttendanceInnerHTML = (attendance: Attendance): string => {
    const signInTimeString: string = formatTime(attendance.signInDate);
    const signOutTimeString: string = formatTime(attendance.signOutDate);

    // 國定假日或請假
    if (signOutTimeString === '' && signInTimeString === '') {
        return '';
    }

    const remainMinutes: number = getRemainMinutes(attendance);
    // 顯示超過或不足的分鐘數
    return `${signOutTimeString} <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        const attendance: Attendance = attendances[i];
        const attendanceContentElement: HTMLTableRowElement = document.createElement('tr');
        if (isToday(attendance.signInDate) === false) {
            attendanceContentElement.style.opacity = '0.5';
        }
        attendanceContentElement.innerHTML = getAttendanceDateTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignInTemplate(attendance);
        if (isToday(attendance.signInDate) === true) {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));
        } else {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getPastDayAttendanceInnerHTML(attendance));
        }
        attendanceContentElement.innerHTML += getLeaveNoteTemplate(attendance.leaveNote);
        table.prepend(attendanceContentElement);
    }
    updateTodayAttendanceContent(table, attendances);
};

const updateAttendanceFavicon = (attendances: Attendance[]) => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(getTodayAttendance(attendances));
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const faviconBadge: FavIconBadge = document.querySelector('favicon-badge');
    faviconBadge.textColor = 'white';
    faviconBadge.badgeSize = 16;

    // 已簽退：不再預測可簽退時間
    if (formatTime(signOutDate) !== '') {
        document.title = '已經簽退';
        faviconBadge.badgeColor = '#3399ff';
        faviconBadge.badge = '離';
        return;
    }

    if (predictedSignOutLeftMinutes > 60) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#737373';
        faviconBadge.badge = `${predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1]}H`;
    } else if (predictedSignOutLeftMinutes > 0) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
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

    // 定時更新內容
    const todayAttendanceFaviconTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班 Favicon');
        updateAttendanceFavicon(attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER, String(todayAttendanceFaviconTimer));
};

const getUpdateLogs = (): string[] => {
    return [
        'v3.4.0(20221223) 自動取得請假和特休狀況的 TOKEN',
        'v3.4.0(20221223) 已簽退就不再預測可簽退時間',
        'v3.4.0(20221223) 顯示出缺勤「異常」的記錄',
        'v3.3.0(20221216) 移除表頭欄位和修改簽到退表格樣式',
        'v3.3.0(20221216) 根據請假情況來調整計算已上班分鐘數',
        'v3.2.1(20221212) 解決取得考勤彙總表參數名稱異動的問題',
        'v3.2.0(20221209) 顯示忘簽到退按鍵',
        'v3.1.0(20221202) 解決請假導致預計時間錯亂的問題',
        'v3.0.0(20221202) 顯示請假資訊',
        'v2.4.1(20221111) 修正 favicon 無限增生的問題',
        'v2.4.0(20221107) 修正 favicon 失效的問題',
        'v2.3.9(20221104) 根據不同剩餘時間來顯示 favicon 樣式和網頁標題',
        'v2.3.8(20221028) 下班提示訊息和畫面一致化',
        'v2.3.7(20221026) 修改彈跳視窗「即將符合下班條件」字眼為「預計 MM 分鐘後」',
        'v2.3.6(20221024) 解決過早上班或是預測過早下班的問題',
        'v2.3.5(20221020) 顯示「符合下班條件」資訊',
        'v2.3.4(20221018) 顯示超時工作的資訊',
        'v2.3.4(20221018) 清空重複執行的出缺勤 timer',
        'v2.3.2(20221013) 顯示更新日誌',
        'v2.3.1(20221013) 新增每五分鐘(簽到、簽退、超時工作)通知訊息視窗',
        'v2.3.1(20221013) 通知訊息視窗點擊「關閉」後當天不會再顯示',
        'v2.2.0(20221012) 解決特休狀況失效的問題',
        'v2.2.0(20221012) 顯示版號和版權資訊',
        'v2.2.0(20221012) 忽略國定假日的簽退內容提示文字',
        'v2.1.0(20221006) 解決每次 wrep 更新時畫面為空的問題',
        'v2.0.0(20221003) 顯示特休狀況',
    ];
};

const appendCopyrightAndVersion = (body: HTMLElement): void => {
    const copyRightDiv: HTMLDivElement = document.createElement('div');
    copyRightDiv.innerText = `ⓚ design © V${PackageJson['wrep-version']}`;
    copyRightDiv.style.textAlign = 'right';
    copyRightDiv.title = getUpdateLogs().slice(0, 5).join('\n');
    body.append(copyRightDiv);
};

const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER)));
};

const initializeFaviconBadge = (): void => {
    document.querySelectorAll('favicon-badge').forEach((faviconBadge: FavIconBadge) => {
        faviconBadge.remove();
    });
    document.querySelectorAll('link[rel="shortcut icon"]').forEach((linkElement: HTMLLinkElement) => {
        linkElement.remove();
    });
    insertFaviconHTML(`<favicon-badge src="" />`);
};

const createAttendanceButton = (text: string, link: string): HTMLElement => {
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.href = link;
    anchorElement.innerText = text;
    anchorElement.title = text;
    anchorElement.className =
        'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only atnd-btn common-btn atndreccssBth attendBtnCss';
    anchorElement.target = '_blank';
    anchorElement.style.background = 'white';
    anchorElement.style.border = '1px solid #c4c4c4';
    anchorElement.style.boxSizing = 'border-box';
    anchorElement.style.boxShadow = '0px 2px 5px rgb(0 0 0 / 25%)';
    anchorElement.style.borderRadius = '4px';
    anchorElement.style.width = 'fit-content';
    anchorElement.style.padding = '0 3px';
    return anchorElement;
};

const prependForgottenAttendanceButton = (): void => {
    const toolbarElement: HTMLTableElement | null = document.querySelector(
        'table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content'
    );
    if (toolbarElement === null || toolbarElement.innerText.includes('忘簽到退') === true) {
        log('忘簽到退按鍵已經載入');
        return;
    }
    const forgottenAttendanceButton: HTMLElement = createAttendanceButton(
        '忘簽到退',
        '/hr-attendance/acs/personal/personal-acs-aply.xhtml'
    );
    toolbarElement.prepend(forgottenAttendanceButton);
};

const restyleAttendanceButtons = (): void => {
    document
        .querySelectorAll('table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content button,span,a')
        .forEach((buttonElement: HTMLButtonElement): void => {
            buttonElement.style.marginRight = '2px';
        });
};

const removeAllAttendanceContent = (table: HTMLTableElement): void => {
    table.parentElement.querySelectorAll('tr').forEach((tr: HTMLTableRowElement) => {
        tr.remove();
    });
};

const restyleAttendanceTable = (table: HTMLTableElement): void => {
    table.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.style.height = '100%';
    table.parentElement.style.height = '90%';
};

const restyleWholePage = (): void => {
    document.querySelector('#todo-bpm').parentElement.className = document
        .querySelector('#todo-bpm')
        .parentElement.className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#right-top-layout').className = document
        .querySelector('#right-top-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
    document.querySelector('#anno-layout').className = document
        .querySelector('#anno-layout')
        .className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#check-in-out-layout').className = document
        .querySelector('#check-in-out-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(
        async (table: HTMLTableElement): Promise<void> => {
            if (table.parentElement.parentElement.innerText.includes('ⓚ design') === true) {
                return;
            }
            initializeFaviconBadge();
            resetAttendanceTimers();
            log('出缺勤表格已經載入');
            const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
            const leaveNotes: string[] = await fetchPersonalLeaveNotes();
            const attendances: Attendance[] = getAttendanceByTrs(trs, leaveNotes);

            removeAllAttendanceContent(table);
            updateAttendanceContent(table, attendances);
            updateAttendanceFavicon(attendances);
            showSignInNotification(attendances);
            appendCopyrightAndVersion(table.parentElement.parentElement);
            prependForgottenAttendanceButton();
            restyleAttendanceButtons();
            restyleAttendanceTable(table);
            restyleWholePage();
        }
    );

    // 待辦事項表格
    waitElementLoaded('.waitingTaskMClass').then(async (table: HTMLTableElement): Promise<void> => {
        if (table.innerText.includes('特休狀況') === true) {
            return;
        }
        log('待辦事項表格已經載入');
        const annualLeave: AnnualLeave | null = await fetchAnnualLeave();
        const annualTemplate: string = getAnnualLeaveTemplate(annualLeave);
        table.insertAdjacentHTML('afterbegin', annualTemplate);
    });
};

(function () {
    moment.locale('zh-tw');
    main();
    window.setInterval((): void => {
        main();
    }, 5 * 1000);
})();
