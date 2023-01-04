import { log } from '@/common/logger';
import * as PackageJson from '@/../package.json';
import UPDATE_LOGS from '@/werp/consts/UpdateLogs';
import UpdateLog from '@/werp/interfaces/UpdateLog';

export const stringifyUpdateLog = (updateLog: UpdateLog): string => {
    return `v${updateLog.version} ${updateLog.date} ${updateLog.messages}`;
};

export const appendCopyrightAndVersion = (body: HTMLElement): void => {
    const copyRightDiv: HTMLDivElement = document.createElement('div');
    copyRightDiv.innerText = `ⓚ design © V${PackageJson['wrep-version']}`;
    copyRightDiv.style.textAlign = 'right';
    copyRightDiv.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    body.append(copyRightDiv);
};

export const createAttendanceButton = (text: string, link: string): HTMLElement => {
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
        .querySelectorAll('table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content button,span,a')
        .forEach((buttonElement: HTMLButtonElement): void => {
            buttonElement.style.marginRight = '4px';
        });
};

export const removeAllAttendanceContent = (table: HTMLTableElement): void => {
    table.querySelectorAll('tr').forEach((tr: HTMLTableRowElement) => {
        tr.remove();
    });
};

export const appendLeaveNoteCaption = (table: HTMLTableElement): void => {
    const leaveCaption: HTMLTableCaptionElement = document.createElement('th');
    leaveCaption.innerHTML = '<span class="ui-column-title">請假/異常</span>';
    table.parentNode.querySelector('thead tr').append(leaveCaption);
};

export const restyleAttendanceTable = (table: HTMLTableElement): void => {
    table.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.style.height = '100%';
    table.parentElement.style.height = '90%';
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
