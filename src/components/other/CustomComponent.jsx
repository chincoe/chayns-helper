import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import types from '../../functions/types';

/**
 * CustomComponent
 * A Component used in other helpers that support adjustable elementTypes and all possible html props for those
 * elements.
 * @param {Object} props
 * @param {Object} props.customProps
 * @param {Object} props.elementProps
 * @param {*|*[]} [props.children=[]]
 * @param {string|*} [props.elementType='div']
 * @return {*}
 * @constructor
 */
const CustomComponent = (
    {
        customProps = {},
        elementProps = {},
        children = [],
        elementType = 'div'
    }
) => {
    const props = useMemo(() => {
        const p = { ...elementProps };
        types.forEachKey(customProps, (key) => {
            delete p[key];
        });
        return p;
    }, [customProps, elementProps]);

    const Component = useMemo(() => elementType, [elementType]);

    return (
        <Component
            {...props}
            {...customProps}
        >
            {children}
        </Component>
    );
};

CustomComponent.propTypes = {
    customProps: PropTypes.objectOf(PropTypes.any).isRequired,
    elementProps: PropTypes.objectOf(PropTypes.any).isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    elementType: PropTypes.elementType
};

CustomComponent.defaultProps = {
    children: [],
    elementType: 'div'
};

CustomComponent.displayName = 'CustomComponent';

export default memo(CustomComponent);
