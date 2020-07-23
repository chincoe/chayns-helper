import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SelectButton } from 'chayns-components';
import httpRequest from '../../Functions/httpRequest';
import useElementProps from '../../Hooks/useElementProps';
import ResizableWaitCursor from '../Other/ResizableWaitCursor';

/**
 * UACGroupChooseButton
 * @param {Object} props
 * @param {number} [props.value=null] - id of the chosen UAC-group
 * @param {function(number)} props.onChange - receives new GroupId as parameter
 * @param {boolean} [props.multiselect=false]
 * @param {boolean} [props.disabled=false]
 * @return {*}
 * @constructor
 */
const UACGroupChooseButton = (props) => {
    const [uacGroups, setUacGroups] = useState();
    const {
        value, onChange, multiSelect = false, disabled = false
    } = props;
    const elementProps = useElementProps(props, {
        value,
        onChange,
        multiSelect,
        disabled,
        list: null,
        label: null,
        onSelect: null,
        listKey: null,
        listValue: null,
        quickfind: null
    });
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
            {...elementProps}
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
