/**
 * @param {function} resolverFn
 * @return {Promise<unknown>}
 */
function AsyncPromise(resolverFn) {
    return new Promise((resolve, reject) => {
        resolve(resolverFn(resolve, reject));
    });
}

export default AsyncPromise;
