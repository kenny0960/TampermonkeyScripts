import moment from 'moment';
import styles from '@/screenshot/css/index.scss';
import { createMainElement } from '@/screenshot/classes/element';
import { Tooltip } from 'bootstrap';

const main = (): void => {
    document.body.insertAdjacentElement('afterbegin', createMainElement());
};

const triggerBootstrapTooltips = (): void => {
    const tooltipTriggerList: NodeListOf<HTMLElement> = document.querySelectorAll('[data-toggle="tooltip"]');

    tooltipTriggerList.forEach((tooltipTriggerElement: HTMLElement) => {
        new Tooltip(tooltipTriggerElement);
    });
};

((): void => {
    moment.locale('zh-tw');
    GM_addStyle(styles);
    main();
    triggerBootstrapTooltips();
})();
