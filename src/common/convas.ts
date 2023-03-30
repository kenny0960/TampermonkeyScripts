export const canvasToBlob = (canvas: HTMLCanvasElement): Blob => {
    const parts: string[] = canvas.toDataURL('image/png').split(';base64,');
    const contentType: string = parts[0].split(':')[1];
    const decodedData: string = window.atob(parts[1]);
    const uint8s: Uint8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
        uint8s[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uint8s], { type: contentType });
};
