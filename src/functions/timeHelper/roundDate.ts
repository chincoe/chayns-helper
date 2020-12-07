import time from '../../constants/time';

const roundDate = (date: Date|string|number, ms: number = time.minute * 5): Date => {
    const d = new Date(date);
    const rounded = Math.round(new Date(d).getTime() / (ms));
    return new Date(rounded * ms);
};

export default roundDate;
