import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Containers.scss';
import useElementProps from '../../Hooks/useElementProps';

/**
 * CenteredContainer
 * Contains and centers one or more children
 * @param {Object} props
 * @param {*|*[]} props.children
 * @param {Object} [props.style={}]
 * @param {string} [props.className='']
 * @param {string} [props.elementType='div'] - Html element type of the container
 * @return {*}
 * @constructor
 */
const CenteredContainer = (props) => {
    const {
        className, style, children, elementType = 'div'
    } = props;
    const elementProps = useElementProps(props, {
        className, style, children, elementType
    });
    const Component = elementType;
    return (
        <Component
            {...elementProps}
            className={classNames(
                'chayns__utils__container',
                'chayns__utils__container--centered',
                'chayns__utils__container--centered-container',
                className
            )}
            style={style}
        >
            {children}
        </Component>
    );
};
CenteredContainer.propTypes = {
    style: PropTypes.objectOf(PropTypes.any),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    elementType: PropTypes.elementType
};
CenteredContainer.defaultProps = {
    style: {},
    children: null,
    className: '',
    elementType: 'div'
};

CenteredContainer.displayName = 'CenteredContainer';

export default CenteredContainer;
