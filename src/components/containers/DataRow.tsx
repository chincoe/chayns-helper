import React, { FunctionComponent, JSXElementConstructor, ReactNode } from 'react';
import clsx from 'clsx';
import './data-row.scss';

export interface DataRowProps {
    className?: string;
    style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
    slim?: boolean;
    children?: ReactNode;
    elementType?: string | JSXElementConstructor<Record<string, unknown>>;
}

/**
 * Container to display its children as label with value(s). The first child will be positioned on the left, all
 * other children to the right.
 * @param className
 * @param style
 * @param slim - remove margins from text children
 * @param children
 * @param elementType - react element type of the container, default: 'div'
 * @param props
 * @constructor
 */
const DataRow: FunctionComponent<DataRowProps> = (
    {
        className = '',
        style = {},
        slim = false,
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
                {
                    'chayns__utils__container--datarow--multiline': Array.isArray(children) && children.length > 2,
                    'chayns__utils__container--datarow--slim': slim
                },
                className
            )}
            style={style}
            {...props}
        >
            {
                Array.isArray(children) && children.length > 2
                    ? (
                        <>
                            <div className="chayns__utils__container--datarow--first-row">
                                {children[0]}
                                {children[1]}
                            </div>
                            {children.slice(2) || null}
                        </>
                    ) : (children || null)
            }
        </Component>
    );
};

export default DataRow;
