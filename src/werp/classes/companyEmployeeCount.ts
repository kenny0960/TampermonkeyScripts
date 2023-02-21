import { Chart } from 'chart';

import { getCompanyEmployeeCountObject } from '@/werp/classes/sessionManager';
import { mergeObject } from '@/common/object';

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
