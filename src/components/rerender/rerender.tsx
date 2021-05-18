import React, {
    JSXElementConstructor, useCallback, useState
} from 'react';
import generateUUID from '../../functions/generateGuid';

/**
 * passes a 'rerenderSelf()' function that allows a function component to trigger a re-render.
 * Example: export default rerender(MyComponent);
 * @param WrappedComponent
 */
export default function rerender(
    WrappedComponent: JSXElementConstructor<Record<string, unknown>>
): JSXElementConstructor<unknown> {
    return (props) => {
        const [rerenderId, setRerenderId] = useState(generateUUID);
        const rerenderComponent = useCallback(() => {
            setRerenderId(generateUUID());
        }, []);
        return (<WrappedComponent rerenderSelf={rerenderComponent} {...props} __rerenderId={rerenderId}/>);
    };
}
