import * as moment from 'moment';
import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import * as html2canvas from 'html2canvas';
import * as PackageJson from '@/../package.json';
import UPDATE_LOGS from '@/screenshot/consts/UpdateLogs';
import { stringifyUpdateLog } from '@/werp/classes/style';
import styles from '@/screenshot/css/index.scss';

export const getCopyrightAndVersionElement = (): HTMLDivElement => {
    const copyRightDiv: HTMLDivElement = document.createElement('div');
    copyRightDiv.id = 'copyright-div';
    copyRightDiv.innerText = `ⓚ design © V${PackageJson['screenshot-version']}`;
    copyRightDiv.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    return copyRightDiv;
};

export const getLineButtonElement = (): HTMLAnchorElement => {
    const lineButton: HTMLAnchorElement = document.createElement('a');
    lineButton.id = 'line-button';
    lineButton.className = 'bi bi-line';
    lineButton.onclick = async (): Promise<void> => {
        const selectorValue: string = getSelectorValue();
        const canvasElement: HTMLCanvasElement = await html2canvas(document.querySelector(selectorValue));
        await sendCanvasElementScreenshot(canvasElement, `${selectorValue} 的截圖`);
    };
    return lineButton;
};

export const getSelectorValue = (): string => {
    const selectorInput: HTMLInputElement | null = document.querySelector('#selector-input');
    if (selectorInput === null) {
        return '';
    }
    return selectorInput.value;
};

export const getSelectorInputElement = (): HTMLInputElement => {
    const selectorInput: HTMLInputElement = document.createElement('input');
    selectorInput.id = 'selector-input';
    selectorInput.placeholder = '請輸入 Selector';
    return selectorInput;
};

export const getScreenshotInputGroupElement = (): HTMLDivElement => {
    const inputGroupDiv: HTMLDivElement = document.createElement('div');
    inputGroupDiv.id = 'input-group';
    inputGroupDiv.appendChild(getSelectorInputElement());
    inputGroupDiv.appendChild(getLineButtonElement());
    return inputGroupDiv;
};

export const getScreenshotFormElement = (): HTMLDivElement => {
    const form: HTMLDivElement = document.createElement('div');
    form.id = 'screenshot-form';
    form.appendChild(getScreenshotInputGroupElement());
    form.appendChild(getCopyrightAndVersionElement());
    return form;
};

export const getMainElement = (): HTMLDivElement => {
    const main: HTMLDivElement = document.createElement('div');
    main.id = 'screenshot';
    main.appendChild(getScreenshotFormElement());
    return main;
};

const main = (): void => {
    document.body.insertAdjacentElement('afterbegin', getMainElement());
};

((): void => {
    moment.locale('zh-tw');
    GM_addStyle(styles);
    main();
})();
