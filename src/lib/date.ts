const IS_DEV = false && process.env.NODE_ENV === 'development';
const YEAR = 2023;
const MONTH = 10;
const DAY = 1;

export function getNowDate(year?: number, month?: number, day?: number): Date {
    return IS_DEV
        ? new Date(YEAR, MONTH - 1, DAY)
        : year && month && day
            ? new Date(year, month - 1, day)
            : new Date(); 
}
