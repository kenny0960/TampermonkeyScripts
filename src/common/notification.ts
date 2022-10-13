export const showNotification = (
    title: string,
    options: NotificationOptions,
    onclose?: ((this: Notification, ev: Event) => any) | null
) => {
    const notification = new Notification(title, options);
    notification.onclose = onclose;
};
