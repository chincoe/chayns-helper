import React, { FunctionComponent, useEffect, useState } from 'react';
import { ChooseButton } from 'chayns-components';
import { SelectDialogItem } from 'chayns-doc';
import request from '../../functions/httpRequest/httpRequest';
import LogLevel from '../../functions/httpRequest/LogLevel';
import { ResponseType } from '../../functions/httpRequest/ResponseType';
import ResizableWaitCursor from '../wait-cursor/ResizableWaitCursor';
import colorLog from '../../utils/colorLog';

declare interface UACGroupChooseButtonProps {
    value: number | number[];
    onChange: (param: SelectDialogItem[]) => void;
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
const UACGroupChooseButton: FunctionComponent<UACGroupChooseButtonProps> = ({
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
            .then((res) => setUacGroups(res as { id: number, showName: string }[]))
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
                    .then(({ buttonType, selection }) => {
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
                    : (uacGroups.find((e) => e.id === (Array.isArray(value) ? value[0] : value)) || {}).showName
                    || 'Wählen'

            }
        </ChooseButton>
    ) : (<ResizableWaitCursor size={24}/>);
};

export default UACGroupChooseButton;
