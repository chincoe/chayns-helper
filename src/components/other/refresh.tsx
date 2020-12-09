import React, {JSXElementConstructor, memo} from 'react';
import useRefresh from '../../utils/useRefresh';

const refresh = (WrappedComponent: JSXElementConstructor<any>, interval: number = 10000) => memo((props) => {
    const [refreshId, refreshFn] = useRefresh(interval);
    return (<WrappedComponent {...props} __refreshId={refreshId} refreshFunction={refreshFn}/>);
});

export default refresh;
