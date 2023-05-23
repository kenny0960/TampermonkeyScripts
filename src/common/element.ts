export const getSelector = (element: HTMLElement | null): string => {
    if (element === null) {
        return '';
    }
    if (element.id) {
        return `#${element.id}`;
    }
    const tagName: string = element.tagName.toLowerCase();
    if (element.className) {
        return `${tagName}.${element.className.replace(/\s+/g, '.')}`;
    }
    return tagName;
};
