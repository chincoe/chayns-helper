import React, { FunctionComponent, useEffect } from 'react';
import './resizable-wait-cursor.scss';
import { SmallWaitCursor } from 'chayns-components';
import clsx from 'clsx';

export interface ResizableWaitCursorProps {
    size?: number;
    className?: string;
    style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
}

/**
 *
 * Resizable version of the chayns-components SmallWaitCursor
 * @param size - size in px
 * @param className
 * @param style
 * @param props
 * @constructor
 */
const ResizableWaitCursor: FunctionComponent<ResizableWaitCursorProps> = ({
    size = 32,
    className = '',
    style = {},
    ...props
}) => {
    useEffect(() => {
        if (size % 3 !== 0) {
            // eslint-disable-next-line no-console
            console.warn('[ResizeableWaitCursor] Size can\'t be divided by 3 - cursor might be malformed!');
        }
        if (size % 2 !== 0) {
            // eslint-disable-next-line no-console
            console.warn('[ResizeableWaitCursor] Size can\'t be divided by 2 - cursor will not be centered!');
        }
    }, [size]);
    return (
        <SmallWaitCursor
            className={clsx('resizable-wait-cursor', className)}
            style={{
                ...style,
                height: size,
                width: size
            }}
            show
            {...props}
        />
    );
};

export default React.memo(ResizableWaitCursor);
