import time from '../../constants/time';

/**
 * Round a date to a certain number of minutes
 * @param date
 * @param ms
 */
const roundDate = (date: Date|string|number, ms: number = time.minute * 5): Date => {
    const d = new Date(date);
    const rounded = Math.round(new Date(d).getTime() / (ms));
    return new Date(rounded * ms);
};

export default roundDate;
