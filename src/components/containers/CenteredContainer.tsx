import React, {FunctionComponent, JSXElementConstructor} from 'react';
import clsx from 'clsx';
import './centered-container.scss';

export interface CenteredContainer {
    className?: string,
    style?: object,
    /**
     * leave a gap between children, ideal for buttons
     */
    gap?: boolean,
    elementType?: string|JSXElementConstructor<any>
}

/**
 * A container to center its children
 * @param className
 * @param style
 * @param children
 * @param gap - leave a gap between the children. Useful to display multiple buttons next to each other
 * @param elementType - react element type of the container, default: 'div'
 * @param props
 * @constructor
 */
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

export default CenteredContainer;
