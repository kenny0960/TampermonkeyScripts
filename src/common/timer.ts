export const sleep = (seconds: number) => {
    return new Promise((resolve): void => {
        setTimeout(resolve, seconds * 1000);
    });
};
