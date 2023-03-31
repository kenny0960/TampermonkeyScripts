export declare type Options = {
    backgroundColor: string | null;
    foreignObjectRendering: boolean;
    removeContainer?: boolean;
};
declare const html2canvas: (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;

export = html2canvas;
