import { shallowEqual, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

/**
 * Shortcut to for a redux selector hook with createSelector
 * @param {function[]} props
 */
const useComplexSelector = (...props) => useSelector(createSelector(...props), shallowEqual);

export default useComplexSelector;
