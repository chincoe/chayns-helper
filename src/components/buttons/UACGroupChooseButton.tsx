import React, {useState, useEffect, FunctionComponent} from 'react';
// @ts-expect-error
import {SelectButton} from 'chayns-components';
import {httpRequest} from '../../functions/httpRequest/httpRequest';
import LogLevel from '../../functions/httpRequest/LogLevel';
import ResponseType from '../../functions/httpRequest/ResponseType';
import ResizableWaitCursor from '../wait-cursor/ResizableWaitCursor';


declare interface UACGroupChooseButton {
    value: number,
    onChange: (param: any) => any,
    multiSelect?: boolean,
    disabled?: boolean
}

const UACGroupChooseButton: FunctionComponent<UACGroupChooseButton> = (
    {
        value = null,
        onChange,
        multiSelect = false,
        disabled = false,
        ...props
    }
) => {
    const [uacGroups, setUacGroups] = useState<{ id: number, showName: string }[]>();
    useEffect(() => {
        httpRequest(
            `https://sub50.tobit.com/backend/${chayns.env.site.locationId}/UserGroup`,
            {},
            'getUacGroups',
            {
                ignoreErrors: true,
                responseType: ResponseType.Json,
                logConfig: {
                    [/.*/.toString()]: LogLevel.info
                }
            }
        )
            .then((res) => setUacGroups(res));
    }, []);

    return uacGroups ? (
        <SelectButton
            list={uacGroups.map((e) => ({
                    id: e.id,
                    name: e.showName
                }
            ))}
            multiSelect={multiSelect}
            label={(uacGroups.find((e) => e.id === value) || {}).showName || 'Wählen'}
            onSelect={onChange}
            listKey="id"
            listValue="name"
            quickFind
            disabled={disabled}
            {...props}
        />
    ) : (<ResizableWaitCursor size={24}/>);
};

export default UACGroupChooseButton;
