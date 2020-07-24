/**
 * A function that automatically creates 2 default pending and fulfilled reducer cases for a RTK asyncThunk
 *
 * @param {Object} thunk - The thunk to create the reducer cases for
 * @param {Function} handler - The handler for thunk.fulfilled
 * @return {Object} thunkCases
 * @public
 */
export const rtkThunkCase = (thunk, handler) => ({
    [thunk.pending]: (draft) => { draft.isLoading = true; },
    [thunk.fulfilled]: handler,
    [thunk.rejected]: (draft) => { draft.isLoading = false; },
});
