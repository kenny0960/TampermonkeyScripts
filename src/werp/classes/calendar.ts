import moment from 'moment';

export const getPickedDateString = (): string => {
    const date: HTMLInputElement | null = document.querySelector('input.ui-state-default');
    if (date === null) {
        return moment().format('YYYY/MM/DD', { trim: false });
    }
    return date.value;
};

export const getPickedYear = (): number => {
    return Number(getPickedDateString().split('/')[0]);
};
