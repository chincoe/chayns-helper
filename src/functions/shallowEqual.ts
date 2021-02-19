function is(x: any, y: any): boolean {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    // eslint-disable-next-line no-self-compare
    return x !== x && y !== y;
}

function checkSimpleEquality(objA: any, objB: any): boolean | null {
    if (is(objA, objB)) return true;

    if (typeof objA !== 'object'
             || objA === null
             || typeof objB !== 'object'
             || objB === null) {
        return false;
    }
    return null

}

/**
 * The react-redux shallow equal function
 * @param objA
 * @param objB
 */
export default function shallowEqual(objA: any, objB: any): boolean {
    const simple = checkSimpleEquality(objA, objB);
    if(simple !== null) return simple;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
        if (
            !Object.prototype.hasOwnProperty.call(objB, keysA[i])
            || !is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false;
        }
    }

    return true;
}

export function deepEqual(objA: any, objB: any): boolean {
    const simple = checkSimpleEquality(objA, objB);
    if(simple !== null) return simple;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
        if (
            !Object.prototype.hasOwnProperty.call(objB, keysA[i])
            || !deepEqual(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false;
        }
    }

    return true;
}
