import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './resizable-wait-cursor.scss';
import { SmallWaitCursor } from 'chayns-components';
import classNames from 'classnames';
import useElementProps from '../../hooks/useElementProps';

/**
 * ResizableWaitCursor
 * The chayns <SmallWaitCursor/> but resizable
 * @param {Object} props
 * @param {number} [props.size=32]
 * @param {string} [props.className='']
 * @param {Object} [props.style={}]
 * @return {*}
 * @constructor
 */
const ResizableWaitCursor = (props) => {
    const { size = 32, className = '', style = {} } = props;
    const elementProps = useElementProps(props, { size, className, style });
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
            className={classNames('resizable-wait-cursor', className)}
            style={{
                ...style,
                height: size,
                width: size
            }}
            show
            {...elementProps}
        />
    );
};

ResizableWaitCursor.propTypes = {
    size: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

ResizableWaitCursor.defaultProps = {
    className: '',
    style: {}
};

ResizableWaitCursor.displayName = 'ResizableWaitCursor';

export default React.memo(ResizableWaitCursor);
