import { sendCanvasElementScreenshot } from '@/common/lineBot/messagingApi';
import html2canvas from 'html2canvas';
import { getSelector } from '@/common/element';

export const sendHighlightElement = async (event: MouseEvent): Promise<void> => {
    // 避免直接點擊到鏈結而跳頁
    event.preventDefault();
    
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
    document.addEventListener('click', sendHighlightElement);
};

export const removeHighlightListener = (): void => {
    document.removeEventListener('mousemove', highlightElement);
    document.removeEventListener('click', sendHighlightElement);
};
