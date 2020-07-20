import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useRefresh from '../../Hooks/useRefresh';
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

/**
 * Higher-Order-Component that will refresh its child component in an interval.
 * Usage in WrappedComponent.jsx: export default refresh(WrappedComponent);
 * @param {*} WrappedComponent
 * @param {number} [interval=10000]
 * @return {*}
 */
export const refresh = (WrappedComponent, interval = 10000) => memo((props) => {
    const [refreshId, refreshFn] = useRefresh(interval);
    return (<WrappedComponent {...props} __refreshId={refreshId} refreshFunction={refreshFn}/>);
});

export default memo(RefreshComponent);
