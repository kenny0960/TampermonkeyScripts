import * as moment from 'moment';
import { Chart } from 'chart';

import { getCompanyEmployeeCountObject } from '@/werp/classes/sessionManager';
import { mergeObject } from '@/common/object';
import { sleep } from '@/common/timer';
import { fetchAllCompanyEmployeeCount } from '@/werp/classes/ajax';
import SessionManager from '@/common/SessionManager';
import SessionKeys from '@/werp/enums/SessionKeys';
import { log } from '@/common/logger';
import { getCompanyEmployeeTemplate } from '@/werp/classes/template';

export const OLD_COMPANY_EMPLOYEE_COUNT: Object = {
    '2022': { '52': 1497, '53': 1497 },
    '2023': { '1': 1498, '2': 1496, '3': 1475, '5': 1448, '6': 1401, '7': 1396 },
};

export const displayCompanyEmployeeCountLineChart = async (): Promise<void> => {
    const companyEmployeeCountObject: Object = mergeObject(
        await getCompanyEmployeeCountObject(),
        OLD_COMPANY_EMPLOYEE_COUNT
    );
    const canvasElement: HTMLCanvasElement = document.getElementById('company_employee_count') as HTMLCanvasElement;
    const data = [];

    for (const year in companyEmployeeCountObject) {
        for (const week in companyEmployeeCountObject[year]) {
            data.push({
                label: `${year}/${week}`,
                count: companyEmployeeCountObject[year][week],
            });
        }
    }

    new Chart(canvasElement, {
        type: 'line',
        data: {
            labels: data.map((row) => row.label),
            datasets: [
                {
                    data: data.map((row) => row.count),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
};

export const getUpdateCompanyEmployeeCountButton = (): HTMLAnchorElement => {
    const anchorElement: HTMLAnchorElement | null = document.querySelector('#update-company-employee-count');
    if (anchorElement === null) {
        return document.createElement('a');
    }
    return anchorElement;
};

export const appendUpdateCompanyEmployeeCountFunction = (): void => {
    getUpdateCompanyEmployeeCountButton().onclick = updateCompanyEmployeeCount;
};

export const updateCompanyEmployeeCountView = (): void => {
    const viewElement: HTMLDivElement | null = document.querySelector('#company-employee-count-template') as HTMLDivElement;
    if (viewElement === null) {
        return;
    }
    viewElement.innerHTML = getCompanyEmployeeTemplate();
};

export const updateCompanyEmployeeCount = async (): Promise<void> => {
    getUpdateCompanyEmployeeCountButton().className += ' fa-spin';
    await sleep(3);
    const companyEmployeeCount: number | null = await fetchAllCompanyEmployeeCount();
    SessionManager.setByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT_TIMESTAMP, String(moment().valueOf()));

    if (companyEmployeeCount === null) {
        return;
    }
    const year: number = moment().year();
    const week: number = moment().week();
    const companyEmployeeCountObject: Object = SessionManager.getObjectByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT);
    companyEmployeeCountObject[year] = {
        ...companyEmployeeCountObject[year],
        [week]: companyEmployeeCount,
    };
    SessionManager.setByKey(SessionKeys.AJAX_COMPANY_EMPLOYEE_COUNT, JSON.stringify(companyEmployeeCountObject));
    log('從伺服器取得公司職員狀況');
    updateCompanyEmployeeCountView();
    appendUpdateCompanyEmployeeCountFunction();
    await displayCompanyEmployeeCountLineChart();
    getUpdateCompanyEmployeeCountButton().className = getUpdateCompanyEmployeeCountButton().className.replace(
        ' fa-spin',
        ''
    );
};
