import { TextString } from 'chayns-components';
import React, {
    memo, useMemo
} from 'react';
import PropTypes from 'prop-types';
import { isNullOrWhiteSpace } from 'chayns-components/lib/utils/is';
import useElementProps from '../hooks/useElementProps';
import types from '../functions/types';

export const TEXTSTRING_CONFIG = {
    PREFIX: ''
};

/**
 * Memoized textstring Component that adds prefix automatically
 * @param {Object} props
 * @param {string} props.stringName
 * @param {string} props.fallback
 * @param {Object.<string,string>} props.replacements
 * @param {*|*[]} props.children
 * @return {*}
 * @constructor
 */
const TextStringMemo = (props) => {
    const {
        stringName, fallback, replacements, children
    } = props;

    const elementProps = useElementProps(props, {
        stringName,
        fallback,
        replacements,
        children
    });

    return (
        <TextString
            {...elementProps}
            stringName={`${TEXTSTRING_CONFIG.PREFIX}${stringName}`}
            fallback={fallback}
            replacements={replacements}
        >
            {children}
        </TextString>
    );
};

TextStringMemo.propTypes = {
    stringName: PropTypes.string.isRequired,
    fallback: PropTypes.string.isRequired,
    replacements: PropTypes.objectOf(PropTypes.string),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired
};

TextStringMemo.defaultProps = {
    replacements: undefined
};

TextStringMemo.displayName = 'TextStringMemo';

TextStringMemo.loadLibrary = async (...params) => {
    TEXTSTRING_CONFIG.PREFIX = types.safeFirst(params);
    await TextString.loadLibrary(...params);
};

export default memo(TextStringMemo);
