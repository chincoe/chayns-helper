import React, {JSXElementConstructor, useCallback, useState} from 'react';
import generateUUID from "../../functions/generateUid";

/**
 * passes a 'rerenderSelf()' function that allows a function component to trigger a re-render.
 * Example: export default rerender(MyComponent);
 * @param WrappedComponent
 */
export default function rerender(WrappedComponent: JSXElementConstructor<any>) {
    return (props: any) => {
        const [rerenderId, setRerenderId] = useState(generateUUID);
        const rerenderComponent = useCallback(() => {
            setRerenderId(generateUUID());
        }, []);
        return (<WrappedComponent rerenderSelf={rerenderComponent} {...props} __rerenderId={rerenderId}/>);
    };
}
