import { time } from '../../../lib/functions/timeHelper';

/**
 * Round a date
 * @param {Date|string|number} date
 * @param {number} [ms]
 * @returns {Date}
 */
const roundDate = (date, ms = time.minute * 5) => {
    const d = new Date(date);
    const rounded = Math.round(new Date(d).getTime() / (ms));
    return new Date(rounded * ms);
};

export default roundDate;
