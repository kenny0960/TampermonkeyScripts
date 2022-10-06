export const waitElementLoaded = (selector: string): Promise<Element> => {
    if (window.MutationObserver === undefined) {
        console.error('請檢查瀏覽器使否支援 MutationObserver');
        return;
    }
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((): void => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
};
