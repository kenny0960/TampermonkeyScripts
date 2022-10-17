import * as moment from 'moment';

export const log = (message: string): void => {
    console.log(`${moment().toLocaleString()}:${message}`);
};
