import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import html2canvas from 'html2canvas';
import * as PackageJson from '@/../package.json';
import UPDATE_LOGS from '@/screenshot/consts/UpdateLogs';
import { stringifyUpdateLog } from '@/werp/classes/style';
import { selectorValidator } from '@/screenshot/classes/validator';
import { notify } from '@/common/lineBot/ajax';
import { bindHighlightListener, removeHighlightListener } from '@/screenshot/classes/listener';

export const createCopyrightAndVersionElement = (): HTMLDivElement => {
    const copyRightElement: HTMLDivElement = document.createElement('div');
    copyRightElement.id = 'copyright-div';
    copyRightElement.innerText = `ⓚ design © V${PackageJson['screenshot-version']}`;
    copyRightElement.title = UPDATE_LOGS.slice(0, 5).map(stringifyUpdateLog).join('\n');
    return copyRightElement;
};

export const createLinkIconElement = (): HTMLUnknownElement => {
    const linkElement: HTMLUnknownElement = document.createElement('i');
    linkElement.className = 'bi bi-link';
    return linkElement;
};

export const createHighlightCloseIconElement = (): HTMLUnknownElement => {
    const closeElement: HTMLUnknownElement = document.createElement('i');
    closeElement.className = 'bi bi-lightning-charge';
    closeElement.onclick = bindHighlightListener;
    return closeElement;
};

export const createExpandIconElement = (): HTMLUnknownElement => {
    const expandElement: HTMLUnknownElement = document.createElement('i');
    expandElement.className = 'bi bi-three-dots';
    // TODO 點擊功能開合效果
    return expandElement;
};

export const isHighlighting = (): boolean => {
    return document.querySelector('#screenshot .bi-lightning-charge-fill') !== null;
};

export const showHighlightCloseIcon = (): void => {
    const iconElement: HTMLUnknownElement = document.querySelector('#screenshot .bi-lightning-charge-fill');
    iconElement.className = 'bi bi-lightning-charge';
    iconElement.parentElement.setAttribute('data-original-title', '開啟隨意截模式');
    iconElement.onclick = bindHighlightListener;
};

export const showHighlightOpenIcon = (): void => {
    const iconElement: HTMLUnknownElement = document.querySelector('#screenshot .bi-lightning-charge');
    iconElement.className = 'bi bi-lightning-charge-fill';
    iconElement.parentElement.setAttribute('data-original-title', '關閉隨意截模式');
    iconElement.onclick = removeHighlightListener;
};

export const handleSelectorSubmit = async (): Promise<void> => {
    const formElement: HTMLFormElement = getScreenshotFormElement();
    const feedBackElement: HTMLDivElement = getSelectorInvalidFeedBackElement();
    const selectorInputElement: HTMLInputElement = getSelectorInputElement();
    if (formElement.checkValidity() === false) {
        formElement.classList.add('was-validated');
        feedBackElement.innerText = selectorInputElement.validationMessage;
        return;
    }
    const selectorValue: string = getSelectorInputElement().value;
    const canvasElement: HTMLCanvasElement = await html2canvas(document.querySelector(selectorValue));
    await sendCanvasElementScreenshot(canvasElement, `${selectorValue} 的截圖`);
};

export const handleLinkSubmit = async (): Promise<void> => {
    await notify(`隨意截的網址：${document.location.href}`);
};

export const handleHighlightToggle = async (event: MouseEvent): Promise<void> => {
    // 避免向下傳遞導致直接觸發隨意截
    event.stopPropagation();

    if (isHighlighting() === true) {
        showHighlightCloseIcon();
        return;
    }
    showHighlightOpenIcon();
};

export const createLinkButtonElement = (): HTMLAnchorElement => {
    const linkButtonElement: HTMLAnchorElement = document.createElement('a');
    linkButtonElement.id = 'link-button';
    linkButtonElement.className = 'btn btn-sm btn-outline-secondary';
    linkButtonElement.setAttribute('data-toggle', 'tooltip');
    linkButtonElement.title = '傳送當前網址';
    linkButtonElement.onclick = handleLinkSubmit;
    linkButtonElement.appendChild(createLinkIconElement());
    return linkButtonElement;
};

export const createHighlightButtonElement = (): HTMLAnchorElement => {
    const highlightButtonElement: HTMLAnchorElement = document.createElement('a');
    highlightButtonElement.id = 'highlight-button';
    highlightButtonElement.className = 'btn btn-sm btn-outline-secondary';
    highlightButtonElement.setAttribute('data-toggle', 'tooltip');
    highlightButtonElement.title = '開啟隨意截模式';
    highlightButtonElement.onclick = handleHighlightToggle;
    highlightButtonElement.appendChild(createHighlightCloseIconElement());
    return highlightButtonElement;
};

export const createExpandButtonElement = (): HTMLAnchorElement => {
    const expandButtonElement: HTMLAnchorElement = document.createElement('a');
    expandButtonElement.id = 'expand-button';
    expandButtonElement.className = 'btn btn-sm btn-outline-secondary';
    expandButtonElement.setAttribute('data-toggle', 'tooltip');
    expandButtonElement.title = '功能開合';
    // TODO 點擊功能開合效果
    expandButtonElement.appendChild(createExpandIconElement());
    return expandButtonElement;
};

export const createButtonGroupElement = (): HTMLDivElement => {
    const buttonGroupElement: HTMLDivElement = document.createElement('div');
    buttonGroupElement.className = 'btn-group';
    buttonGroupElement.appendChild(createLinkButtonElement());
    buttonGroupElement.appendChild(createHighlightButtonElement());
    buttonGroupElement.appendChild(createExpandButtonElement());
    return buttonGroupElement;
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
    selectorInputElement.addEventListener('input', (): void => {
        const formElement: HTMLFormElement = getScreenshotFormElement();
        const validator: string = selectorValidator(selectorInputElement.value);
        formElement.classList.remove('was-validated');
        selectorInputElement.setCustomValidity(validator);
    });
    return selectorInputElement;
};

export const createHeaderElement = (): HTMLDivElement => {
    const headerElement: HTMLDivElement = document.createElement('div');
    headerElement.id = 'header';
    headerElement.className = 'd-flex justify-content-end align-items-center';
    headerElement.appendChild(createButtonGroupElement());
    return headerElement;
};

export const createFooterElement = (): HTMLDivElement => {
    const footerElement: HTMLDivElement = document.createElement('div');
    footerElement.id = 'footer';
    footerElement.className = 'd-flex justify-content-end align-items-center';
    footerElement.appendChild(createCopyrightAndVersionElement());
    return footerElement;
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
    formElement.appendChild(createHeaderElement());
    formElement.appendChild(createFooterElement());
    formElement.addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
        await handleSelectorSubmit();
        event.preventDefault();
    });
    return formElement;
};

export const createMainElement = (): HTMLDivElement => {
    const mainElement: HTMLDivElement = document.createElement('div');
    mainElement.id = 'screenshot';
    mainElement.appendChild(createScreenshotFormElement());
    return mainElement;
};
