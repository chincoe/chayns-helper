import React, { useCallback, useState } from 'react';
import generateUUID from 'chayns-logger/lib/core/generate-uid';

/**
 * @param {function(*): JSXElement|null} WrappedComponent
 * @returns {function(*): *}
 */
export default function rerender(WrappedComponent) {
    return (props) => {
        const [rerenderId, setRerenderId] = useState(generateUUID);
        const rerenderComponent = useCallback(() => {
            setRerenderId(generateUUID());
        }, []);
        return (<WrappedComponent rerenderSelf={rerenderComponent} {...props} __rerenderId={rerenderId}/>);
    };
}
