export const selectorValidator = (selectorValue: string): string => {
    if (selectorValue === '') {
        return '請填寫這個欄位。';
    }
    try {
        if (document.querySelector(selectorValue) === null) {
            return `'${selectorValue}' 找不到任何元件`;
        }
    } catch (e) {
        return `'${selectorValue}' 不是有效的 Selector`;
    }
    return '';
};
