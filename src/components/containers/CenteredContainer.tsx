import React, {FunctionComponent, JSXElementConstructor} from 'react';
import clsx from 'clsx';
import './centered-container.scss';

export interface CenteredContainer {
    className?: string,
    style?: object,
    gap?: boolean,
    elementType?: string|JSXElementConstructor<any>
}

const CenteredContainer: FunctionComponent<CenteredContainer> = (
    {
        className = '',
        style = {},
        children = null,
        gap = false,
        elementType = 'div',
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
                'chayns__utils__container--centered-container',
                {
                    'chayns__utils__container--centered-container--gap': gap
                },
                className
            )}
            style={style}
        >
            {children}
        </Component>
    );
};

CenteredContainer.displayName = 'CenteredContainer';

export default CenteredContainer;
