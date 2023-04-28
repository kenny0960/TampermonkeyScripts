import * as moment from 'moment';
import styles from '@/screenshot/css/index.scss';
import { createMainElement } from '@/screenshot/classes/element';

const main = (): void => {
    document.body.insertAdjacentElement('afterbegin', createMainElement());
};

((): void => {
    moment.locale('zh-tw');
    GM_addStyle(styles);
    main();
})();
