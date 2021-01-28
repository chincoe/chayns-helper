import React, {FunctionComponent, JSXElementConstructor, memo, ReactChildren} from 'react';
import useRefresh from '../../utils/useRefresh';

/**
 * Container that rerenders its children in the specified interval
 * @param interval - interval in ms to rerender, default: 10000
 * @param children
 * @param elementType - react element type of the container, default: 'div'
 * @param props
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

export default memo(Refresh);
