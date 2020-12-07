import React, {JSXElementConstructor, useCallback, useState} from 'react';
// @ts-ignore
import generateUUID from "../../functions/generateUid";

export default function rerender(WrappedComponent: JSXElementConstructor<any>) {
    return (props: any) => {
        const [rerenderId, setRerenderId] = useState(generateUUID);
        const rerenderComponent = useCallback(() => {
            setRerenderId(generateUUID());
        }, []);
        return (<WrappedComponent rerenderSelf={rerenderComponent} {...props} __rerenderId={rerenderId}/>);
    };
}
