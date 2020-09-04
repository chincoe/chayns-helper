import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './containers.scss';
import useElementProps from '../../hooks/useElementProps';
import types from '../../functions/types';

/**
 * DataRow
 * Contains several elements and positions the first as label on the left and everything else on the right
 * @param {Object} props
 * @param {*|*[]} props.children
 * @param {Object} [props.style={}]
 * @param {string} [props.className='']
 * @param {string} [props.elementType='div'] - Html element type of the container
 * @return {*}
 * @constructor
 */
const DataRow = (props) => {
    const {
        className, style, children, elementType = 'div'
    } = props;
    const elementProps = useElementProps(props, {
        className, style, children, elementType
    });
    return (
        <div
            className={classNames(
                'chayns__utils__container',
                'chayns__utils__container--datarow',
                className
            )}
            style={style}
            {...elementProps}
        >
            {types.isArray(children) ? types.safeFirst(children) : children}
            {types.isArray(children)
            && <div className="chayns__utils__container--datarow--right">{children.slice(1)}</div>}
        </div>
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
