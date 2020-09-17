import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SelectButton } from 'chayns-components';
import { httpRequest } from '../../functions/httpRequest';
import ResizableWaitCursor from '../wait-cursor/ResizableWaitCursor';

/**
 * UACGroupChooseButton
 * @param {Object} props
 * @param {number} [value=null] - id of the chosen UAC-group
 * @param {function(number)} props.onChange - receives new GroupId as parameter
 * @param {boolean} [multiselect=false]
 * @param {boolean} [disabled=false]
 * @return {*}
 * @constructor
 */
const UACGroupChooseButton = (
    {
        value,
        onChange,
        multiSelect = false,
        disabled = false,
        ...props
    }
) => {
    const [uacGroups, setUacGroups] = useState();
    useEffect(() => {
        httpRequest(
            `https://sub50.tobit.com/backend/${chayns.env.site.locationId}/UserGroup`,
            {},
            'getUacGroups'
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

UACGroupChooseButton.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool,
    disabled: PropTypes.bool
};

UACGroupChooseButton.defaultProps = {
    value: null,
    multiSelect: false,
    disabled: false
};

UACGroupChooseButton.displayName = 'UACGroupChooseButton';

export default UACGroupChooseButton;
