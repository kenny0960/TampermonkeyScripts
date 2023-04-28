import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import * as html2canvas from 'html2canvas';
import * as PackageJson from '@/../package.json';
import UPDATE_LOGS from '@/screenshot/consts/UpdateLogs';
import { stringifyUpdateLog } from '@/werp/classes/style';

export const createCopyrightAndVersionElement = (): HTMLDivElement => {
    const copyRightElement: HTMLDivElement = document.createElement('div');
    copyRightElement.id = 'copyright-div';
    copyRightElement.innerText = `ⓚ design © V${PackageJson['screenshot-version']}`;
    copyRightElement.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    return copyRightElement;
};

export const createLineIconElement = (): HTMLUnknownElement => {
    const iconElement: HTMLUnknownElement = document.createElement('i');
    iconElement.className = 'bi bi-line';
    return iconElement;
};

export const createLineButtonElement = (): HTMLAnchorElement => {
    const lineButtonElement: HTMLAnchorElement = document.createElement('a');
    lineButtonElement.id = 'line-button';
    lineButtonElement.onclick = async (): Promise<void> => {
        const selectorValue: string = getSelectorInputElement().value;
        const canvasElement: HTMLCanvasElement = await html2canvas(document.querySelector(selectorValue));
        await sendCanvasElementScreenshot(canvasElement, `${selectorValue} 的截圖`);
    };
    lineButtonElement.appendChild(createLineIconElement());
    return lineButtonElement;
};

export const getSelectorInputElement = (): HTMLInputElement => {
    const selectorInputElement: HTMLInputElement | null = document.querySelector('#selector-input');
    if (selectorInputElement === null) {
        return createSelectorInputElement();
    }
    return selectorInputElement;
};

export const createSelectorInputElement = (): HTMLInputElement => {
    const selectorInputElement: HTMLInputElement = document.createElement('input');
    selectorInputElement.id = 'selector-input';
    selectorInputElement.className = 'form-control';
    selectorInputElement.placeholder = '請輸入 Selector';
    selectorInputElement.required = true;
    return selectorInputElement;
};

export const createScreenshotInputGroupElement = (): HTMLDivElement => {
    const inputGroupElement: HTMLDivElement = document.createElement('div');
    inputGroupElement.id = 'input-group';
    inputGroupElement.className = 'position-relative';
    inputGroupElement.appendChild(createSelectorInputElement());
    inputGroupElement.appendChild(createSelectorValidFeedBackElement());
    inputGroupElement.appendChild(createSelectorInvalidFeedBackElement());
    inputGroupElement.appendChild(createLineButtonElement());
    return inputGroupElement;
};

export const getSelectorValidFeedBackElement = (): HTMLDivElement => {
    const feedBackElement: HTMLDivElement | null = document.querySelector('.valid-tooltip');
    if (feedBackElement === null) {
        return createSelectorValidFeedBackElement();
    }
    return feedBackElement;
};

export const createSelectorValidFeedBackElement = (): HTMLDivElement => {
    const feedBackElement: HTMLDivElement = document.createElement('div');
    feedBackElement.className = 'valid-tooltip';
    return feedBackElement;
};

export const getSelectorInvalidFeedBackElement = (): HTMLDivElement => {
    const feedBackElement: HTMLDivElement | null = document.querySelector('.invalid-tooltip');
    if (feedBackElement === null) {
        return createSelectorInvalidFeedBackElement();
    }
    return feedBackElement;
};

export const createSelectorInvalidFeedBackElement = (): HTMLDivElement => {
    const feedBackElement: HTMLDivElement = document.createElement('div');
    feedBackElement.className = 'invalid-tooltip';
    return feedBackElement;
};

export const getScreenshotFormElement = (): HTMLFormElement => {
    const formElement: HTMLFormElement | null = document.querySelector('#screenshot-form');
    if (formElement === null) {
        return createScreenshotFormElement();
    }
    return formElement;
};

export const createScreenshotFormElement = (): HTMLFormElement => {
    const formElement: HTMLFormElement = document.createElement('form');
    formElement.id = 'screenshot-form';
    formElement.noValidate = true;
    formElement.appendChild(createScreenshotInputGroupElement());
    formElement.appendChild(createCopyrightAndVersionElement());
    return formElement;
};

export const createMainElement = (): HTMLDivElement => {
    const mainElement: HTMLDivElement = document.createElement('div');
    mainElement.id = 'screenshot';
    mainElement.appendChild(createScreenshotFormElement());
    return mainElement;
};
