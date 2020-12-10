import React, {FunctionComponent, JSXElementConstructor} from 'react';
import clsx from 'clsx';
// @ts-expect-error
import { SmallWaitCursor } from 'chayns-components';
import './centered-wait-cursor.scss';

const CenteredWaitCursor: FunctionComponent<{
    className?: string,
    style?: object
    elementType?: string|JSXElementConstructor<any>;
    delay?: number
}> = (
    {
        className = '',
        style = {},
        children = null,
        elementType = 'div',
        delay = 300,
        ...elementProps
    }
) => {
    const Component = elementType;
    return (
        <Component
            {...elementProps}
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

CenteredWaitCursor.displayName = 'CenteredWaitCursor';

export default CenteredWaitCursor;
