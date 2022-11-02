export const getFaviconDom = (url: string): HTMLLinkElement => {
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    return link;
};

export const updateFavicon = (url: string): void => {
    const heads: HTMLCollectionOf<HTMLHeadElement> = document.getElementsByTagName('head');
    heads[0].appendChild(getFaviconDom(url));
};

export const insertFaviconHTML = (faviconHTML: string): void => {
    const heads: HTMLCollectionOf<HTMLHeadElement> = document.getElementsByTagName('head');
    heads[0].innerHTML += faviconHTML;
};
