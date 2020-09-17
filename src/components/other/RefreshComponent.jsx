import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useRefresh from '../../_internal/useRefresh';

/**
 * Refresh
 * A component that rerenders its child in a certain interval
 * @param {Object} props
 * @param {number} [interval=10000] - Interval to rerender this component and its children in ms
 * @param {*|*[]} [children=null]
 * @param {string|*} [elementType='div']
 * @return {*}
 * @constructor
 */
const Refresh = (
    {
        interval = 10000,
        children,
        elementType = 'div',
        ...props
    }
) => {
    const [refreshId] = useRefresh(interval);
    const Component = elementType;

    return (
        <Component id={refreshId} {...props}>
            {children}
        </Component>
    );
};

Refresh.propTypes = {
    elementType: PropTypes.elementType,
    interval: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node), PropTypes.string])
};

Refresh.defaultProps = {
    elementType: 'div',
    interval: 10000,
    children: null
};

Refresh.displayName = 'RefreshComponent';

export default memo(Refresh);
