import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import html2canvas from 'html2canvas';
import { getSelector } from '@/common/element';

export const sendHighlightElement = async (): Promise<void> => {
    const highlightedElement: HTMLElement | null = document.querySelector('.highlight');

    if (highlightedElement === null) {
        return;
    }

    highlightedElement.classList.remove('highlight');
    const selector: string = getSelector(highlightedElement);
    const canvasElement: HTMLCanvasElement = await html2canvas(highlightedElement);
    await sendCanvasElementScreenshot(canvasElement, `${selector} 的截圖`);
};

export const highlightElement = (event: MouseEvent): void => {
    const highlightedElement: HTMLElement | null = document.querySelector('.highlight');

    if (highlightedElement !== null) {
        highlightedElement.classList.remove('highlight');
    }

    const targetElement: HTMLElement = event.target as HTMLElement;
    targetElement.classList.add('highlight');
};

export const bindHighlightListener = (): void => {
    document.addEventListener('mousemove', highlightElement);
};

export const removeHighlightListener = (): void => {
    document.removeEventListener('mousemove', highlightElement);
};

export const bindClickListener = (): void => {
    document.addEventListener('click', sendHighlightElement);
};

export const removeClickListener = (): void => {
    document.removeEventListener('click', sendHighlightElement);
};
