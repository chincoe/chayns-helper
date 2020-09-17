import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './centered-container.scss';

/**
 * CenteredContainer
 * Contains and centers one or more children
 * @param {Object} props
 * @param {*|*[]} children
 * @param {Object} [style={}]
 * @param {string} [className='']
 * @param {string} [elementType='div'] - Html element type of the container
 * @param {boolean} [gap=false] - Leave a gap between each child element
 * @return {*}
 * @constructor
 */
const CenteredContainer = (
    {
        className,
        style,
        children,
        gap = false,
        elementType = 'div',
        ...props
    }
) => {
    const Component = elementType;
    return (
        <Component
            {...props}
            className={classNames(
                'chayns__utils__container',
                'chayns__utils__container--centered',
                'chayns__utils__container--centered-container',
                {
                    'chayns__utils__container--centered-container--gap': gap
                },
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
    elementType: PropTypes.elementType,
    gap: PropTypes.bool,
};
CenteredContainer.defaultProps = {
    style: {},
    children: null,
    className: '',
    elementType: 'div',
    gap: false
};

CenteredContainer.displayName = 'CenteredContainer';

export default CenteredContainer;
