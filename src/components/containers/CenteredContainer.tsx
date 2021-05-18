import React, { FunctionComponent, JSXElementConstructor, ReactNode } from 'react';
import clsx from 'clsx';
import './centered-container.scss';

export interface CenteredContainerProps {
    className?: string;
    style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
    gap?: boolean;
    vertical?: boolean;
    elementType?: string | JSXElementConstructor<Record<string, unknown>>;
    children: ReactNode;
}

/**
 * A container to center its children
 * @param className
 * @param style
 * @param children
 * @param gap - leave a gap between the children. Useful to display multiple buttons next to each other
 * @param vertical - align children vertically instead of horizontally
 * @param elementType - react element type of the container, default: 'div'
 * @param props
 * @constructor
 */
const CenteredContainer: FunctionComponent<CenteredContainerProps> = (
    {
        className = '',
        style = {},
        children = null,
        gap = false,
        vertical = false,
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
                    'chayns__utils__container--centered-container--gap': gap,
                    'chayns__utils__container--centered-container--vertical': vertical
                },
                className
            )}
            style={style}
        >
            {children}
        </Component>
    );
};

export default CenteredContainer;
