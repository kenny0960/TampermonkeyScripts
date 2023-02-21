import { Chart } from 'chart';

import { getCompanyEmployeeCountObject } from '@/werp/classes/sessionManager';

export const displayCompanyEmployeeCountLineChart = async (): Promise<void> => {
    const companyEmployeeCountObject: Object = await getCompanyEmployeeCountObject();
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
