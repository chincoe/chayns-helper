import React, { FunctionComponent, JSXElementConstructor, ReactChildren } from 'react';
import clsx from 'clsx';
import './data-row.scss';

export interface DataRow {
    className?: string,
    style?: object,
    children?: ReactChildren,
    elementType?: string | JSXElementConstructor<any>
}

/**
 * Container to display its children as label with value(s). The first child will be positioned on the left, all other
 * children to the right.
 * @param className
 * @param style
 * @param children
 * @param elementType - react element type of the container, default: 'div'
 * @param props
 * @constructor
 */
const DataRow: FunctionComponent<DataRow> = (
    {
        className = '',
        style = {},
        children = null,
        elementType = 'div',
        ...props
    }
) => {
    const Component = elementType;
    return (
        <Component
            className={clsx(
                'chayns__utils__container',
                'chayns__utils__container--datarow',
                className
            )}
            style={style}
            {...props}
        >
            {Array.isArray(children) ? children[0] || null : children}
            {Array.isArray(children)
             && <div className="chayns__utils__container--datarow--right">{children.slice(1)}</div>}
        </Component>
    );
};

export default DataRow;
