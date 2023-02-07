export const formatChineseMonth = (month: string): number => {
    switch (month) {
        case '一月':
            return 1;
        case '二月':
            return 2;
        case '三月':
            return 3;
        case '四月':
            return 4;
        case '五月':
            return 5;
        case '六月':
            return 6;
        case '七月':
            return 7;
        case '八月':
            return 8;
        case '九月':
            return 9;
        case '十月':
            return 10;
        case '十一月':
            return 11;
        case '十二月':
            return 12;
    }
    return 0;
};
