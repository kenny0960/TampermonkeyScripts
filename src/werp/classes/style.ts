import { log } from '@/common/logger';
import * as PackageJson from '@/../package.json';
import UPDATE_LOGS from '@/werp/consts/UpdateLogs';
import UpdateLog from '@/common/interfaces/UpdateLog';
import Attendance from '@/werp/interfaces/Attendance';
import { sendAttendances, sendAttendancesScreenshot } from '@/werp/classes/lineBot/messagingApi';
import { HAS_LINE_MESSAGE_API_AUTH } from '@/common/consts/env';

export const stringifyUpdateLog = (updateLog: UpdateLog): string => {
    return `v${updateLog.version} ${updateLog.date} ${updateLog.messages}`;
};

export const getCopyrightAndVersionElement = (): HTMLAnchorElement => {
    const copyRightLink: HTMLAnchorElement = document.createElement('a');
    copyRightLink.innerText = `ⓚ design © V${PackageJson['werp-version']}`;
    copyRightLink.style.textAlign = 'right';
    copyRightLink.style.padding = '0.25rem 0';
    copyRightLink.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    copyRightLink.href = 'https://github.com/kenny0960/TampermonkeyScripts/tree/master/src/werp';
    copyRightLink.target = '_blank';
    return copyRightLink;
};

export const createAttendanceButton = (text: string, link: string): HTMLElement => {
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    if (link !== '') {
        anchorElement.href = link;
    }
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

export const getCameraIcon = (): HTMLUnknownElement => {
    const iconElement: HTMLUnknownElement = document.createElement('i');
    iconElement.className = 'fa fa-camera';
    iconElement.style.cursor = 'pointer';
    return iconElement;
};

export const getSendIcon = (id: string = ''): HTMLUnknownElement => {
    const iconElement: HTMLUnknownElement = document.createElement('i');
    iconElement.id = id;
    iconElement.className = 'fa fa-paper-plane';
    iconElement.style.cursor = 'pointer';
    return iconElement;
};

export const prependSendAttendancesButton = (attendances: Attendance[]): void => {
    const toolbarElement: HTMLTableElement | null = document.querySelector(
        'table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content'
    );
    if (toolbarElement === null || toolbarElement.innerHTML.includes('fa-paper-plane') === true) {
        log('傳送出缺勤按鍵已經載入');
        return;
    }
    if (HAS_LINE_MESSAGE_API_AUTH === false) {
        return;
    }
    const sendAttendanceButton: HTMLElement = createAttendanceButton('', '');
    sendAttendanceButton.style.padding = '0 10px';
    sendAttendanceButton.onclick = (): void => {
        sendAttendances(attendances);
    };
    sendAttendanceButton.insertAdjacentElement('afterbegin', getSendIcon());
    toolbarElement.prepend(sendAttendanceButton);
};

export const prependSendAttendancesScreenshotButton = (): void => {
    const toolbarElement: HTMLTableElement | null = document.querySelector(
        'table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content'
    );
    if (toolbarElement === null || toolbarElement.innerHTML.includes('camera') === true) {
        log('傳送出缺勤截圖按鍵已經載入');
        return;
    }
    if (HAS_LINE_MESSAGE_API_AUTH === false) {
        return;
    }
    const sendAttendanceButton: HTMLElement = createAttendanceButton('', '');
    sendAttendanceButton.style.padding = '0 10px';
    sendAttendanceButton.onclick = async (): Promise<void> => {
        await sendAttendancesScreenshot();
    };
    sendAttendanceButton.insertAdjacentElement('afterbegin', getCameraIcon());
    toolbarElement.prepend(sendAttendanceButton);
};

export const prependForgottenAttendanceButton = (): void => {
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

export const restyleAttendanceButtons = (): void => {
    document
        .querySelectorAll('#formTemplate\\:attend_rec_panel-title .ui-panel-content > *')
        .forEach((buttonElement: HTMLButtonElement): void => {
            buttonElement.style.marginRight = '4px';
        });
};

export const restyleAttendanceTable = (tableSectionElement: HTMLTableSectionElement): void => {
    tableSectionElement.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
    tableSectionElement.parentElement.parentElement.parentElement.style.height = '100%';
    tableSectionElement.parentElement.parentElement.style.height = '100%';
};

export const restyleWholePage = (): void => {
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
