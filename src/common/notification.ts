export const handleNotificationClick = (event: Event): void => {
    event.preventDefault();
    window.open('https://cy.iwerp.net/portal/');
};

export const showNotification = (title: string, options: NotificationOptions) => {
    const notification = new Notification(title, options);
    notification.onclick = handleNotificationClick;
};
