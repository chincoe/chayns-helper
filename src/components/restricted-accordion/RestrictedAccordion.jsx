import React from 'react';
import { Accordion, Icon } from 'chayns-components';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import './restricted-accordion.scss';

/**
 * restricted-accordion
 * A restricted accordion for certain UAC-Groups with a lock icon
 * @param {Object} props
 * @param {string} [className='']
 * @param {*|*[]} children
 * @param {function(string)} [onSearch]
 * @param {function(string)} [onSearchEnter]
 * @param {boolean} [useAdminStyle=true]
 * @return {*}
 * @constructor
 */
const RestrictedAccordion = (
    {
        className,
        children,
        onSearch,
        onSearchEnter,
        useAdminStyle = true,
        ...props
    }
) => (
    <Accordion
        right={!(useAdminStyle === false) ? (<Icon icon="fas fa-lock"/>) : null}
        {...props}
        className={clsx(
            { 'accordion--restricted': !(useAdminStyle === false) },
            { 'accordion--restricted-search': onSearch || onSearchEnter },
            className
        )}
    >
        {children}
    </Accordion>
);

RestrictedAccordion.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    className: PropTypes.string,
    onSearch: PropTypes.func,
    onSearchEnter: PropTypes.func,
    useAdminStyle: PropTypes.bool
};

RestrictedAccordion.defaultProps = {
    className: undefined,
    onSearch: undefined,
    onSearchEnter: undefined,
    useAdminStyle: true
};

RestrictedAccordion.displayName = 'RestrictedAccordion';

export default RestrictedAccordion;
