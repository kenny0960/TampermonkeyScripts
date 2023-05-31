import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import html2canvas from 'html2canvas';
import { getSelector } from '@/common/element';
import { showHighlightCloseIcon, isHighlighting } from '@/screenshot/classes/element';

export const sendHighlightElement = async (event: MouseEvent): Promise<void> => {
    // 避免直接點擊到鏈結而跳頁
    event.preventDefault();
    removeHighlightedElement();

    const targetElement: HTMLElement = event.target as HTMLElement;
    const selector: string = getSelector(targetElement);
    const canvasElement: HTMLCanvasElement = await html2canvas(targetElement);
    await sendCanvasElementScreenshot(canvasElement, `${selector} 的截圖`);
};

export const highlightElement = (event: MouseEvent): void => {
    removeHighlightedElement();

    const targetElement: HTMLElement = event.target as HTMLElement;
    targetElement.classList.add('highlight');
};

export const removeHighlightedElement = (): void => {
    const highlightedElement: HTMLElement | null = document.querySelector('.highlight');

    if (highlightedElement === null) {
        return;
    }

    highlightedElement.classList.remove('highlight');
};

export const escapeHighlighting = (event: KeyboardEvent): void => {
    if (isHighlighting() === false) {
        return;
    }
    if (event.key === 'Escape') {
        showHighlightCloseIcon();
        removeHighlightedElement();
        removeHighlightListener();
    }
};

export const bindHighlightListener = (): void => {
    document.addEventListener('mousemove', highlightElement);
    document.addEventListener('click', sendHighlightElement);
    document.addEventListener('keydown', escapeHighlighting);
};

export const removeHighlightListener = (): void => {
    document.removeEventListener('mousemove', highlightElement);
    document.removeEventListener('click', sendHighlightElement);
    document.removeEventListener('keydown', escapeHighlighting);
};
