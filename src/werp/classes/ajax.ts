import * as moment from 'moment';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import { Moment } from '@/moment';
import LeaveNote from '@/werp/interfaces/LeaveNote';
import LeaveReceiptNote from '@/werp/interfaces/LeaveReceiptNote';
import { getPickedDate } from '@/werp/classes/momentUtility';
import AjaxPattern from '@/werp/interfaces/AjaxPattern';

export const fetchCompanyEmployeeToken = async (): Promise<string | null> => {
    return await fetch('https://cy.iwerp.net/system/hr/showEmpData.xhtml', {
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
            return inputElement.value.trim();
        });
};

export const fetchAllCompanyEmployeeCount = async (): Promise<number | null> => {
    return await fetch('https://cy.iwerp.net/system/hr/showEmpData.xhtml', {
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
        referrer: 'https://cy.iwerp.net/system/hr/showEmpData.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `javax.faces.partial.ajax=true&javax.faces.source=id_dataTable&javax.faces.partial.execute=id_dataTable&javax.faces.partial.render=id_dataTable&id_dataTable=id_dataTable&id_dataTable_filtering=true&id_dataTable_encodeFeature=true&formTemplate=formTemplate&j_idt20_selection=0&id_dataTable%3Aj_idt29%3Afilter=&id_dataTable%3Aj_idt31%3Afilter=&id_dataTable%3Aj_idt32%3Afilter=&id_dataTable%3Aj_idt34%3Afilter=&id_dataTable%3Aj_idt36%3Afilter=&id_dataTable_scrollState=0%2C0&javax.faces.ViewState=${await fetchCompanyEmployeeToken()}`,
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
            const extension: HTMLElement | null = html.querySelector('extension');
            if (extension === null) {
                return null;
            }
            return Number(JSON.parse(extension.innerText.trim()).totalRecords);
        });
};

export const fetchAnnualLeave = async (): Promise<AnnualLeave | null> => {
    const { session }: AjaxPattern = await fetchPersonalLeaveReceiptNotesAjaxPattern();
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
        body: `javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F11%2F26&j_idt158_input=2022%2F12%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=${session}`,
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

export const fetchPersonalLeaveNotesAjaxPattern = async (): Promise<AjaxPattern | null> => {
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
            const sessionElement: HTMLInputElement | null = html.querySelector('input[id="j_id1:javax.faces.ViewState:0"]');
            const searchElements: NodeListOf<HTMLInputElement> = html.querySelectorAll('#searchContent input');
            if (sessionElement === null || searchElements.length < 2) {
                return null;
            }
            return {
                session: encodeURIComponent(sessionElement.value.trim()),
                searchRange: {
                    start: searchElements.item(0).name,
                    end: searchElements.item(1).name,
                },
            };
        });
};

export const fetchPersonalLeaveNotes = async (): Promise<LeaveNote[]> => {
    const pickedDate: Moment = getPickedDate();
    const { searchRange, session }: AjaxPattern = await fetchPersonalLeaveNotesAjaxPattern();
    const endDate: string = pickedDate.day(5).format('YYYY/MM/DD', { trim: false });
    const startDate: string = pickedDate.day(1).format('YYYY/MM/DD', { trim: false });
    const searchDateRange: string = `&${searchRange.start}=${startDate}&${searchRange.end}=${endDate}`;

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
        body: `javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt152_input=2022%2F11%2F26&j_idt156_input=2022%2F12%2F25&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=${session}`.replace(
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
            const leaveNotes: LeaveNote[] = [];
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            html.querySelectorAll('.ui-datatable-frozenlayout-right tbody tr').forEach(
                (tr: HTMLTableRowElement, index: number) => {
                    const unusualNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(2);
                    const unsignedNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(5);
                    const receiptNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(3);
                    if (unusualNoteElement !== null && unsignedNoteElement !== null && receiptNoteElement !== null) {
                        leaveNotes[index + 1] = {
                            unusualNote: unusualNoteElement.innerText.trim(),
                            unsignedNote: unsignedNoteElement.innerText.trim(),
                            receiptNote: receiptNoteElement.innerText.trim(),
                        };
                    }
                }
            );
            return leaveNotes;
        });
};

export const fetchPersonalLeaveReceiptNotesAjaxPattern = async (): Promise<AjaxPattern> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
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
            const sessionElement: HTMLInputElement | null = html.querySelector('input[id="j_id1:javax.faces.ViewState:0"]');
            const searchElements: NodeListOf<HTMLInputElement> = html.querySelectorAll('#searchContent input');
            if (sessionElement === null || searchElements.length < 2) {
                return null;
            }
            return {
                session: encodeURIComponent(sessionElement.value.trim()),
                searchRange: {
                    start: searchElements.item(0).name,
                    end: searchElements.item(1).name,
                },
            };
        });
};

export const fetchPersonalLeaveReceiptNotes = async (): Promise<LeaveReceiptNote[]> => {
    const { session, searchRange }: AjaxPattern = await fetchPersonalLeaveReceiptNotesAjaxPattern();
    const endDate: string = moment().add(2, 'months').format('YYYY/MM/DD', { trim: false });
    const startDate: string = moment().subtract(7, 'days').format('YYYY/MM/DD', { trim: false });
    const searchDateRange: string = `&${searchRange.start}=${startDate}&${searchRange.end}=${endDate}`;

    return fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
            pragma: 'no-cache',
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+leaveaply-datatable&search-btn=search-btn&formTemplate=formTemplate&j_idt154_input=2022%2F11%2F26&j_idt158_input=2022%2F12%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=HOUR&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=${session}`.replace(
            /&j_idt154_input=\d+%2F\d+%2F\d+&j_idt158_input=\d+%2F\d+%2F\d+/,
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
            const leaveReceiptNotes: LeaveReceiptNote[] = [];
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            html.querySelectorAll('.ui-datatable-scrollable-body tbody tr:not(.ui-datatable-empty-message)').forEach(
                (tr: HTMLTableRowElement) => {
                    const tds: HTMLCollectionOf<HTMLTableCellElement> = tr.getElementsByTagName('td');

                    if (tds.length === 0) {
                        return;
                    }

                    const typeElement: HTMLDivElement | null = tds.item(6);
                    const noteElement: HTMLDivElement | null = tds.item(7);
                    const startDateElement: HTMLDivElement | null = tds.item(8);
                    const startTimeElement: HTMLDivElement | null = tds.item(9);
                    const endDateElement: HTMLDivElement | null = tds.item(10);
                    const endTimeElement: HTMLDivElement | null = tds.item(11);
                    const hoursElement: HTMLDivElement | null = tds.item(12);
                    const statusElement: HTMLDivElement | null = tds.item(15);
                    if (typeElement !== null && statusElement !== null) {
                        leaveReceiptNotes.push({
                            type: typeElement.innerText.trim(),
                            note: noteElement.innerText.trim(),
                            start: moment(`${startDateElement.innerText.trim()} ${startTimeElement.innerText.trim()}`),
                            end: moment(`${endDateElement.innerText.trim()} ${endTimeElement.innerText.trim()}`),
                            hours: Number(hoursElement.innerText.trim()),
                            status: statusElement.innerText.trim(),
                        });
                    }
                }
            );
            return leaveReceiptNotes;
        });
};
