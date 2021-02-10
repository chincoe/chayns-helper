import React, {JSXElementConstructor, memo} from 'react';
import useRefresh from '../../utils/useRefresh';

/**
 * HOC that re-renders the component in a certain interval.
 * Example: export default refresh(MyComponent, 10000);
 * @param WrappedComponent - the component to be wrapped
 * @param interval - interval in ms to rerender, default: 10000
 */
const refresh = (WrappedComponent: JSXElementConstructor<any>, interval: number = 10000) => memo((props) => {
    const [refreshId, refreshFn] = useRefresh(interval);
    return (<WrappedComponent {...props} __refreshId={refreshId} refreshFunction={refreshFn}/>);
});

export default refresh;
