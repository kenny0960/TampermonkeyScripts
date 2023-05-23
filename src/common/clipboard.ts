export const copyToClipboard = (text: string): void => {
    const textAreaElement: HTMLTextAreaElement = document.createElement('textarea');
    textAreaElement.style.position = 'fixed';
    textAreaElement.style.opacity = '0';
    textAreaElement.value = text;
    document.body.appendChild(textAreaElement);
    textAreaElement.select();
    document.execCommand('copy');
    document.body.removeChild(textAreaElement);
};
