import * as moment from 'moment';

import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import { Moment } from '@/moment';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import Attendance from '@/werp/interfaces/Attendance';
import { formatTime, formatWeekday } from '@/werp/classes/momentUtility';
import { getRemainMinutes, getSummaryRemainMinutes } from '@/werp/classes/attendanceUtility';
import { convertEmptyStringToDash } from '@/werp/classes/converter';
import { FlexBox, FlexBubble, FlexCarousel, FlexComponent, FlexFiller, FlexSeparator, FlexSpan, FlexText } from '@/lineBot';
import Announcement from '@/werp/interfaces/Announcement';

export const getFlexSeparator = (): FlexSeparator => {
    return {
        type: 'separator',
    };
};

export const getFlexFiller = (): FlexFiller => {
    return {
        type: 'filler',
    };
};

export const getLeaveReceiptNoteFlexBubble = (leaveReceiptNote: LeaveReceiptNote): FlexBubble => {
    const startDate: Moment = moment(leaveReceiptNote.start);
    const endDate: Moment = moment(leaveReceiptNote.end);
    return {
        type: 'bubble',
        hero: {
            type: 'image',
            url: 'https://www.bonigala.com/wp-content/uploads/2013/01/holiday-mood.jpg',
            size: 'full',
            aspectRatio: '16:9',
            aspectMode: 'cover',
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    weight: 'bold',
                    size: 'xl',
                    text: '請假單',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '假別',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: leaveReceiptNote.type,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '日期',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: `${startDate.format('YYYY/MM/DD (dd) HH:mm', { trim: false })} \t${endDate.format(
                                        'YYYY/MM/DD (dd) HH:mm',
                                        { trim: false }
                                    )}`,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '小時',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: String(leaveReceiptNote.hours),
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '狀態',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 1,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: leaveReceiptNote.status,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
};

export const getLeaveNoteFlexBubble = (leaveNote: LeaveNote): FlexBubble => {
    const components: FlexComponent[] = [
        {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
                {
                    type: 'text',
                    text: '班表日',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 4,
                },
                {
                    type: 'text',
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                    text: leaveNote.datetime,
                },
            ],
        },
    ];

    if (leaveNote.unsignedNote !== '') {
        components.push({
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
                {
                    type: 'text',
                    text: '未簽核完成單據',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 4,
                },
                {
                    type: 'text',
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                    text: leaveNote.unsignedNote,
                },
            ],
        });
    }

    if (leaveNote.unusualNote !== '') {
        components.push({
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
                {
                    type: 'text',
                    text: '異常',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 4,
                },
                {
                    type: 'text',
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                    text: leaveNote.unusualNote,
                },
            ],
        });
    }

    return {
        type: 'bubble',
        hero: {
            type: 'image',
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCf1SLT4rwk-IPRvI1rSez_c0coUXcHMGfXg&usqp=CAU',
            size: '5xl',
            aspectMode: 'cover',
            aspectRatio: '16:8',
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: components,
        },
    };
};

export const getLeaveReceiptNotesFlexCarousel = (leaveReceiptNotes: LeaveReceiptNote[]): FlexCarousel => {
    const contents: FlexBubble[] = [];
    for (const leaveReceiptNote of leaveReceiptNotes) {
        contents.push(getLeaveReceiptNoteFlexBubble(leaveReceiptNote));
    }
    return {
        type: 'carousel',
        contents: contents,
    };
};

export const getLeaveNotesFlexCarousel = (leaveNotes: LeaveNote[]): FlexCarousel => {
    const contents: FlexBubble[] = [];
    for (const leaveNote of leaveNotes) {
        contents.push(getLeaveNoteFlexBubble(leaveNote));
    }
    return {
        type: 'carousel',
        contents: contents,
    };
};

export const getAnnualLeaveFlexBubble = (annualLeave: AnnualLeave): FlexBubble => {
    return {
        type: 'bubble',
        hero: {
            type: 'image',
            url: 'https://s3cdn.yourator.co/ckeditor/pictures/data/000/002/305/content/48adb844b4f92f6934358b08796d2b44979f0901.png',
            size: 'full',
            aspectRatio: '18:8',
            aspectMode: 'cover',
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    weight: 'bold',
                    size: 'xl',
                    text: '特休狀況',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '已休(含在途)',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 3,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: String(annualLeave.leaveHours),
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '未休',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 3,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: String(annualLeave.notLeaveHours),
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: '有效日',
                                    color: '#aaaaaa',
                                    size: 'sm',
                                    flex: 3,
                                },
                                {
                                    type: 'text',
                                    wrap: true,
                                    color: '#666666',
                                    size: 'sm',
                                    flex: 5,
                                    text: annualLeave.endDatetime,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
};

export const getAttendanceTableHeaderComponent = (): FlexComponent => {
    return {
        type: 'box',
        layout: 'horizontal',
        contents: [
            {
                type: 'text',
                text: '班表日',
                size: 'md',
                align: 'center',
            },
            {
                type: 'text',
                text: '簽到',
                size: 'md',
                align: 'center',
            },
            {
                type: 'text',
                text: '簽退',
                size: 'md',
                align: 'center',
            },
        ],
        paddingAll: 'md',
    };
};

export const getAttendanceSignOutLeftMinutesFlexSpan = (attendance: Attendance): FlexSpan => {
    const remainMinutes: number = getRemainMinutes(attendance);

    // 沒有簽退記錄或國定假日或請假直接不計算
    if (formatTime(attendance.signOutDate) === '' || formatTime(attendance.signInDate) == '') {
        return {
            type: 'span',
            text: ' ',
        };
    }

    return {
        type: 'span',
        text: `(${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})`,
        color: remainMinutes >= 0 ? '#008000' : '#ff0000',
    };
};

export const getAttendanceTableBodyComponents = (attendances: Attendance[]): FlexComponent[] => {
    const components: FlexComponent[] = [];
    for (let i = 1; i < attendances.length; i++) {
        components.push({
            type: 'box',
            layout: 'horizontal',
            contents: [
                {
                    type: 'text',
                    text: `${attendances[i].signInDate.format('MM/DD', { trim: false })} (${formatWeekday(
                        attendances[i].signInDate
                    )})`,
                    size: 'md',
                    align: 'center',
                },
                {
                    type: 'text',
                    text: convertEmptyStringToDash(formatTime(attendances[i].signInDate)),
                    size: 'md',
                    align: 'center',
                },
                {
                    type: 'text',
                    size: 'md',
                    align: 'center',
                    contents: [
                        {
                            type: 'span',
                            text: convertEmptyStringToDash(formatTime(attendances[i].signOutDate)),
                        },
                        getAttendanceSignOutLeftMinutesFlexSpan(attendances[i]),
                    ],
                },
            ],
            paddingAll: 'md',
        });
    }
    return components;
};

export const getAttendanceSummaryFlexText = (attendances: Attendance[]): FlexText => {
    const remainMinutes: number = getSummaryRemainMinutes(attendances);
    return {
        type: 'text',
        text: remainMinutes >= 0 ? `+${remainMinutes}` : String(remainMinutes),
        size: 'lg',
        weight: 'bold',
        align: 'center',
        color: remainMinutes >= 0 ? '#008000' : '#ff0000',
    };
};

export const getAttendanceTableFooterComponent = (attendances: Attendance[]): FlexBox => {
    return {
        type: 'box',
        layout: 'horizontal',
        contents: [
            {
                type: 'text',
                text: '小計',
                size: 'md',
                align: 'center',
            },
            getFlexFiller(),
            getAttendanceSummaryFlexText(attendances),
        ],
        paddingAll: 'md',
    };
};

export const getAttendancesFlexBubble = (attendances: Attendance[]): FlexBubble => {
    return {
        type: 'bubble',
        size: 'giga',
        hero: {
            type: 'image',
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNHTdvv_Asj1Cl4btV091kqPTVg4MsOG6NB_FEY1sbdlemb2EoNCi3OHtUx_3RiyZPiOk&usqp=CAU',
            size: 'full',
            aspectRatio: '16:10',
            aspectMode: 'cover',
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                getAttendanceTableHeaderComponent(),
                getFlexSeparator(),
                ...getAttendanceTableBodyComponents(attendances),
                getFlexSeparator(),
                getAttendanceTableFooterComponent(attendances),
            ],
        },
    };
};

export const getAttendancesScreenshotFlexBubble = (imageUrl: string): FlexBubble => {
    return {
        type: 'bubble',
        size: 'giga',
        body: {
            spacing: 'md',
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '當週出缺勤狀況截圖',
                    size: 'xl',
                    weight: 'bold',
                },
                {
                    type: 'image',
                    size: 'full',
                    aspectMode: 'fit',
                    url: imageUrl,
                    animated: true,
                    aspectRatio: '16:9',
                },
            ],
        },
    };
};

export const getCompanyEmployeeCountFlexBubble = (imageUrl: string): FlexBubble => {
    return {
        type: 'bubble',
        size: 'giga',
        body: {
            spacing: 'md',
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '公司在職人數',
                    size: 'xl',
                    weight: 'bold',
                },
                {
                    type: 'image',
                    size: 'full',
                    aspectMode: 'fit',
                    url: imageUrl,
                    animated: true,
                    aspectRatio: '16:9',
                },
            ],
        },
    };
};

export const getAnnouncementFlexBubble = (announcement: Announcement): FlexBubble => {
    const [startDatetime, endDatetime]: string[] = announcement.duration.split('～');
    const [startDate]: string[] = startDatetime.trim().split(' ');
    const [endDate]: string[] = endDatetime.trim().split(' ');
    return {
        type: 'bubble',
        size: 'giga',
        hero: {
            type: 'image',
            url: 'https://www.shutterstock.com/image-vector/megaphone-important-announcement-vector-flat-260nw-1949944333.jpg',
            aspectMode: 'cover',
            size: 'full',
            aspectRatio: '16:8',
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: announcement.subject,
                    wrap: true,
                    size: 'lg',
                    weight: 'bold',
                },
                {
                    type: 'text',
                    text: announcement.type,
                    align: 'end',
                    size: 'xxs',
                    style: 'italic',
                },
                {
                    type: 'text',
                    align: 'end',
                    size: 'xxs',
                    style: 'italic',
                    contents: [
                        {
                            type: 'span',
                            text: startDate,
                        },
                        {
                            type: 'span',
                            text: '~',
                        },
                        {
                            type: 'span',
                            text: endDate,
                        },
                    ],
                },
                {
                    type: 'text',
                    text: announcement.content,
                    size: 'xs',
                    wrap: true,
                },
            ],
        },
    };
};
