import React, { FunctionComponent, useEffect, useState } from 'react';
// @ts-expect-error chayns-components doesn't have types
import { ChooseButton } from 'chayns-components';
import request from '../../functions/httpRequest/httpRequest';
import { LogLevel } from '../../functions/httpRequest/LogLevel';
import { ResponseType } from '../../functions/httpRequest/ResponseType';
import ResizableWaitCursor from '../wait-cursor/ResizableWaitCursor';
import colorLog from '../../utils/colorLog';

declare interface UACGroupChooseButton {
    value: number | number[];
    onChange: (param: any) => any;
    multiSelect?: boolean;
    disabled?: boolean;
}

/**
 * A Button that opens a select dialog to choose one or more UAC groups from the current site
 * @param value - currently selected uacGroupId
 * @param onChange - onChange handler
 * @param multiSelect - select multiple groups at once
 * @param disabled - disable the button
 * @param props
 * @constructor
 */
const UACGroupChooseButton: FunctionComponent<UACGroupChooseButton> = ({
    value = null,
    onChange,
    multiSelect = false,
    disabled = false,
    ...props
}) => {
    const [uacGroups, setUacGroups] = useState<{ id: number, showName: string }[]>();
    useEffect(() => {
        request.fetch(
            `https://sub50.tobit.com/backend/${chayns.env.site.locationId}/UserGroup`,
            {},
            'getUacGroups',
            {
                throwErrors: false,
                responseType: ResponseType.Json,
                logConfig: {
                    [/.*/.toString()]: LogLevel.info
                }
            }
        )
            .then((res) => setUacGroups(res))
            .catch((ex) => {
                console.error(...colorLog.gray('[UACGroupChooseButton]'), 'Failed to fetch UAC Groups.', ex);
            });
    }, []);

    return uacGroups ? (
        <ChooseButton
            onClick={() => {
                chayns.dialog.select({
                    list: uacGroups.map((e) => ({
                            value: e.id,
                            name: e.showName,
                            isSelected: Array.isArray(value) && value.includes(e.id)
                        }
                    )),
                    multiselect: multiSelect,
                    quickfind: Array.isArray(uacGroups) && uacGroups.length > 5
                })
                    .then(({ buttonType, selection }: {
                        buttonType: number, selection: Array<{
                            name: string,
                            value: number,
                            backgroundColor?: string,
                            className?: string,
                            url?: string,
                            isSelected?: boolean
                        }>
                    }) => {
                        if (buttonType === 1) {
                            onChange(selection);
                        }
                    });
            }}
            disabled={disabled}
            {...props}
        >
            {
                Array.isArray(value) && value.length > 1
                    ? `${value.length} Gruppen`
                    : (uacGroups.find((e) => e.id === (Array.isArray(value) ? value[0] : value)) || {}).showName ||
                      'Wählen'

            }
        </ChooseButton>
    ) : (<ResizableWaitCursor size={24}/>);
};

export default UACGroupChooseButton;
