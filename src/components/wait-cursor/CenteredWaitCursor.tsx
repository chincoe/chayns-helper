import React, { FunctionComponent, JSXElementConstructor } from 'react';
import clsx from 'clsx';
// @ts-expect-error
import { SmallWaitCursor } from 'chayns-components';
import './centered-wait-cursor.scss';

/**
 * chayns-components SmallWaitCursor that centers itself, adds a margin and is only displayed after a delay
 * @param className
 * @param style
 * @param children
 * @param elementType - react element type of the container around the wait cursor, default: 'div'
 * @param delay - delay until the wait cursor is displayed
 * @param props
 * @constructor
 */
const CenteredWaitCursor: FunctionComponent<{
    className?: string;
    style?: object;
    elementType?: string | JSXElementConstructor<any>;
    delay?: number;
}> = (
    {
        className = '',
        style = {},
        children = null,
        elementType = 'div',
        delay = 300,
        ...props
    }
) => {
    const Component = elementType;
    return (
        <Component
            {...props}
            className={clsx(
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

export default CenteredWaitCursor;
