import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useRefresh from '../../hooks/useRefresh';
import CustomComponent from './CustomComponent';

/**
 * RefreshComponent
 * A component that rerenders its child in a certain interval
 * @param {Object} props
 * @param {number} [props.interval=10000] - Interval to rerender this component and its children in ms
 * @param {*|*[]} [props.children=null]
 * @param {string|*} [props.elementType='div']
 * @return {*}
 * @constructor
 */
const RefreshComponent = (props) => {
    const { interval = 10000, children, elementType = 'div' } = props;
    const [refreshId] = useRefresh(interval);

    return children ? (
        <CustomComponent
            customProps={{
                id: `refresh_${refreshId}`,
                elementType,
                interval: undefined
            }}
            elementProps={props}
            elementType={elementType}
        >
            {children}
        </CustomComponent>
    ) : (
               <CustomComponent
                   customProps={{
                       id: `refresh_${refreshId}`,
                       elementType,
                       interval: undefined
                   }}
                   elementProps={props}
                   elementType={elementType}
               />
           );
};

RefreshComponent.propTypes = {
    elementType: PropTypes.elementType,
    interval: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node), PropTypes.string])
};

RefreshComponent.defaultProps = {
    elementType: 'div',
    interval: 10000,
    children: null
};

RefreshComponent.displayName = 'RefreshComponent';

export default memo(RefreshComponent);
