import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SmallWaitCursor } from 'chayns-components';
import './centered-wait-cursor.scss';

/**
 * CenteredWaitCursor
 * A full-width centered <SmallWaitCursor/> with padding that is displayed after a short delay. Use this as placeholder
 * for content that is still loading.
 * @param {Object} props
 * @param {*|*[]} props.children
 * @param {Object} [props.style={}]
 * @param {string} [props.className='']
 * @param {string} [props.elementType='div'] - Html element type of the container
 * @param {number} [props.delay=300] - Delay in ms after which the waitCursor will be displayed
 * @return {*}
 * @constructor
 */
const CenteredWaitCursor = (
    {
        className,
        style,
        children,
        elementType = 'div',
        delay = 300,
        ...elementProps
    }
) => {
    const Component = elementType;
    return (
        <Component
            {...elementProps}
            className={classNames(
                'chayns__utils__container',
                'chayns__utils__container--centered',
                'chayns__utils__container--centered-wait-cursor',
                className
            )}
            style={{
                animation: `${delay}ms fade-in`,
                ...style
            }}
        >
            {children ?? <SmallWaitCursor show/>}
        </Component>
    );
};
CenteredWaitCursor.propTypes = {
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    className: PropTypes.string,
    delay: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    elementType: PropTypes.elementType
};
CenteredWaitCursor.defaultProps = {
    style: {},
    className: '',
    delay: 300,
    children: null,
    elementType: 'div'
};

CenteredWaitCursor.displayName = 'CenteredWaitCursor';

export default CenteredWaitCursor;
