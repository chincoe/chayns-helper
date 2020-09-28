/**
 * @typedef tickFormatter
 * @param {number|*} start
 * @param {number} intervalLength
 * @param {number} i
 *
 * @returns {number|*}
 */
/**
 * @param {number|*} start - minimum value of data or axis start
 * @param {number|*} end - maximum value of data
 * @param {number|number[]} divisor - for all axis ticks: tick % divisor = 0
 * @param {number} maxTicks - maximum amount of ticks
 * @param {number} minTicks - minimum amount of ticks
 * @param {tickFormatter} [tickFormatter] - function to format
 * @returns {{min: *, max: *, ticks: [], intervalCount: number, intervalLength: number}}
 */
const generateAxis = (
    start,
    end,
    divisor,
    maxTicks,
    minTicks,
    tickFormatter
) => {
    // eslint-disable-next-line no-param-reassign
    if (!tickFormatter) tickFormatter = (base, intervalLength, i) => (base + intervalLength * i);

    let relevantDivisor;
    if (chayns.utils.isArray(divisor)) {
        const divisorList = divisor.sort((a, b) => a - b);
        for (let i = 0; i < divisorList.length; i++) {
            const d = divisorList[i];
            if (d * maxTicks > end) {
                relevantDivisor = d;
                break;
            }
        }
        if (!relevantDivisor) relevantDivisor = divisorList[divisorList.length - 1];
    } else {
        relevantDivisor = divisor;
    }

    const difference = end - start;
    const intervalLength = Math.ceil(difference / relevantDivisor / maxTicks) * relevantDivisor;
    const intervalCount = Math.max(Math.ceil(difference / intervalLength), minTicks);

    const ticks = [];
    for (let i = 0; i < intervalCount; i++) {
        ticks.push(tickFormatter(start, intervalLength, i));
    }

    return {
        intervalCount,
        intervalLength,
        min: start,
        max: tickFormatter(ticks[ticks.length - 1], intervalLength, 1),
        ticks
    };
};

export default generateAxis;
