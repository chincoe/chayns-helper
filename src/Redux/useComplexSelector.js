import { shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { chaynsHelperConfig } from '../chaynsHelperConfig';

/**
 * Shortcut to for a redux selector hook with createSelector
 * @param {function[]} props
 * @return {*} - selected part of state
 */
const useComplexSelector = (...props) => chaynsHelperConfig.getSelector()(createSelector(...props), shallowEqual);

export default useComplexSelector;
