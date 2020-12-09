import React, {FunctionComponent, JSXElementConstructor, ReactChildren} from 'react';
import clsx from 'clsx';
import './data-row.scss';


export interface DataRow {
    className?: string,
    style?: object,
    children?: ReactChildren,
    elementType?: string|JSXElementConstructor<any>
}

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
            {/* @ts-ignore */}
            {chayns.utils.isArray(children) ? children[0] || null : children}
            {chayns.utils.isArray(children)
                // @ts-ignore
            && <div className="chayns__utils__container--datarow--right">{children.slice(1)}</div>}
        </Component>
    );
};

DataRow.displayName = 'DataRow';

export default DataRow;
