import React, {FunctionComponent, JSXElementConstructor, memo, ReactChildren} from 'react';
import useRefresh from '../../utils/useRefresh';

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
const Refresh: FunctionComponent<{
    interval?: number,
    children?: ReactChildren;
    elementType?: string|JSXElementConstructor<any>
}> = (
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

Refresh.displayName = 'RefreshComponent';

export default memo(Refresh);
