import React, { memo } from 'react';
import useRefresh from '../../hooks/useRefresh';

/**
 * Higher-Order-Component that will refresh its child component in an interval.
 * Usage in WrappedComponent.jsx: export default refresh(WrappedComponent);
 * @param {*} WrappedComponent
 * @param {number} [interval=10000]
 * @return {*}
 */
const refresh = (WrappedComponent, interval = 10000) => memo((props) => {
    const [refreshId, refreshFn] = useRefresh(interval);
    return (<WrappedComponent {...props} __refreshId={refreshId} refreshFunction={refreshFn}/>);
});

export default refresh;
