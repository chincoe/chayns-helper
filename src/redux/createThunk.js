import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * createThunk
 * @param {string} typePrefix
 * @param {function} payloadCreator
 * @param {Object} options
 * @return {AsyncThunk<RejectWithValue<GetRejectValue<{}>>, void, {}>}
 */
const createThunk = (typePrefix, payloadCreator, options) => createAsyncThunk(
    typePrefix,
    async (arg, thunkApi) => new Promise((resolve) => {
        resolve(payloadCreator(arg, { resolve, ...thunkApi }));
    }),
    options
);

export default createThunk;
