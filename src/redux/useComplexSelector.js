import { shallowEqual, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Shortcut to for a redux selector hook with createSelector
 * @param {function[]} props
 * @return {*} - selected part of state
 */
const useComplexSelector = (...props) => useSelector(createSelector(...props), shallowEqual);

export default useComplexSelector;
