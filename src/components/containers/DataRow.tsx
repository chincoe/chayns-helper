import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import './data-row.scss';

/**
 * DataRow
 * Contains several elements and positions the first as label on the left and everything else on the right
 * @param {Object} props
 * @param {*|*[]} children
 * @param {Object} [style={}]
 * @param {string} [className='']
 * @param {string} [elementType='div'] - Html element type of the container
 * @return {*}
 * @constructor
 */
const DataRow = (
    {
        className,
        style,
        children,
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
            {chayns.utils.isArray(children) ? children[0] || null : children}
            {chayns.utils.isArray(children)
            && <div className="chayns__utils__container--datarow--right">{children.slice(1)}</div>}
        </Component>
    );
};
DataRow.propTypes = {
    style: PropTypes.objectOf(PropTypes.any),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    elementType: PropTypes.elementType
};
DataRow.defaultProps = {
    style: {},
    children: null,
    className: '',
    elementType: 'div'
};

DataRow.displayName = 'DataRow';

export default DataRow;
