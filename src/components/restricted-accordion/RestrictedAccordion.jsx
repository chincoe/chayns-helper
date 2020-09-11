import React from 'react';
import { Accordion, Icon } from 'chayns-components';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './restricted-accordion.scss';
import useElementProps from '../../_internal/useElementProps';

/**
 * restricted-accordion
 * A restricted accordion for certain UAC-Groups with a lock icon
 * @param {Object} props
 * @param {string} [props.className='']
 * @param {*|*[]} props.children
 * @param {function(string)} [props.onSearch]
 * @param {function(string)} [props.onSearchEnter]
 * @param {boolean} [props.useAdminStyle=true]
 * @return {*}
 * @constructor
 */
const RestrictedAccordion = (props) => {
    const {
        className, children, onSearch, onSearchEnter, useAdminStyle = true
    } = props;
    const elementProps = useElementProps(props, {
        className, children, onSearch, onSearchEnter, useAdminStyle
    });
    return (
        <Accordion
            right={!(useAdminStyle === false) ? (<Icon icon="fas fa-lock"/>) : null}
            {...elementProps}
            className={classNames(
                { 'accordion--restricted': !(useAdminStyle === false) },
                { 'accordion--restricted-search': onSearch || onSearchEnter },
                className
            )}
        >
            {children}
        </Accordion>
    );
};

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
