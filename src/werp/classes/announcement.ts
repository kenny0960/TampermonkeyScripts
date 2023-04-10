import { getSendIcon } from '@/werp/classes/style';
import { fetchAnnouncement } from '@/werp/classes/ajax';
import { sendAnnouncement } from '@/werp/classes/lineBot/messagingApi';
import Announcement from '@/werp/interfaces/Announcement';
import { HAS_LINE_MESSAGE_API_AUTH } from '@/werp/consts/env';

export const prependSendAnnouncementButtons = (tableSectionElement: HTMLTableSectionElement): void => {
    const trsElement: HTMLTableRowElement[] = Array.from(tableSectionElement.querySelectorAll('tr'));

    if (HAS_LINE_MESSAGE_API_AUTH === false) {
        return;
    }

    for (const trElement of trsElement) {
        const td: HTMLTableCellElement = trElement.querySelector('td');
        const url: string = (trElement.querySelector('td:nth-child(3) > a') as HTMLAnchorElement).href;
        const urlSearchParams: URLSearchParams = new URLSearchParams(new URL(url).search);
        const sid: string = urlSearchParams.get('sid');
        const sendIcon: HTMLUnknownElement = getSendIcon();
        sendIcon.onclick = async (): Promise<void> => {
            const announcement: Announcement = await fetchAnnouncement(sid);
            await sendAnnouncement(announcement);
        };
        td.innerHTML = '';
        td.insertAdjacentElement('afterbegin', sendIcon);
    }
};
