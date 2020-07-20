import React, {
    useEffect, useRef, useMemo
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ChaynsEditor.scss';
import useElementProps from 'chayns-helper/Hooks/useElementProps';

/**
 * @callback eventListenerCallback
 * @param {Event} event
 */
/**
 * ChaynsEditor Component
 * Can be disabled and handles the editorRef as well as the event listeners.
 * Can never be fully controlled as setting the current html inside the editor will move the cursor to the beginning of
 * the text box.
 * Do NOT use chayns.utils.editor.disable()/enable() manually if you use this component
 * @param {Object} props
 * @param {string|*} [props.elementType='div'] - Type of the html element for the editor
 * @param {string} [props.value='']
 * @param {eventListenerCallback} [props.onChange]
 * @param {string} [props.className='']
 * @param {string} [props.placeholder='']
 * @param {eventListenerCallback} [props.onFocus]
 * @param {eventListenerCallback} [props.onBlur]
 * @param {Object} [props.style={}]
 * @param {string|string[]} [props.disabledTools=[]]
 * @param {string} [props.type='']
 * @param {boolean} [props.disabled=false]
 * @return {*}
 * @constructor
 */
const ChaynsEditor = (props) => {
    const {
        elementType = 'div',
        value,
        style = {},
        onChange,
        className,
        placeholder,
        onFocus,
        onBlur,
        type,
        disabledTools,
        disabled,
    } = props;
    const initialValue = useMemo(() => value, []);
    const editorRef = useRef({ current: null });

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    useEffect(() => {
        editorRef.current.addEventListener('editorChange', onChange);
        editorRef.current.addEventListener('editorFocus', onFocus);
        editorRef.current.addEventListener('editorBlur', onBlur);
        chayns.utils.editor.enable();
    }, []);

    const elementProps = useElementProps(props, {
        initialValue,
        value,
        onChange,
        className,
        placeholder,
        type,
        disabled,
        onBlur,
        onFocus,
        disabledTools,
        elementType,
        style,
        contentEditable: null,
        'chayns-editor': null,
        'chayns-editor-placeholder': null,
        'chayns-editor-disable-tools': null
    });

    const Component = elementType;

    return (
        <Component
            className={classNames('ChaynsEditor', 'accordion--no-trigger', {
                'chayns-editor--enabled': !disabled,
                'chayns-editor--disabled': disabled
            }, className)}
            contentEditable={disabled ? false : null}
            chayns-editor={disabled ? true : type}
            chayns-editor-placeholder={placeholder}
            chayns-editor-disable-tools={disabledTools.join(', ')}
            ref={editorRef}
            style={style}
            disabled={disabled}
            {...elementProps}
        >
            {initialValue}
        </Component>
    );
};

const ChaynsEditorTools = {
    block: {
        font: 'block_font',
        align: 'block_align',
        ul: 'block_ul',
        ol: 'block_ol',
        image: 'block_image'
    },
    text: {
        bold: 'text_bold',
        italic: 'text_italic',
        underline: 'text_underline',
        link: 'link'
    }
};

const ChaynsEditorType = {
    simple: '',
    wysiwyg: 'wysiwyg',
    image: 'image'
};

ChaynsEditor.type = ChaynsEditorType;
ChaynsEditor.tools = ChaynsEditorTools;

ChaynsEditor.propTypes = {
    elementType: PropTypes.elementType,
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.any),
    disabledTools: PropTypes.oneOfType([
        PropTypes.oneOf(
            [
                ...Object.values(ChaynsEditorTools.block),
                ...Object.values(ChaynsEditorTools.text)
            ]
        ),
        PropTypes.arrayOf(
            PropTypes.oneOf(
                [
                    ...Object.values(ChaynsEditorTools.block),
                    ...Object.values(ChaynsEditorTools.text)
                ]
            )
        )
    ]),
    type: PropTypes.oneOf([...Object.values(ChaynsEditorType)]),
    disabled: PropTypes.bool
};

ChaynsEditor.defaultProps = {
    elementType: 'div',
    value: '',
    onChange: () => {
    },
    className: '',
    placeholder: '',
    onFocus: () => {
    },
    onBlur: () => {
    },
    style: {},
    type: ChaynsEditorType.simple,
    disabledTools: [],
    disabled: false
};

ChaynsEditor.displayName = 'ChaynsEditor';

export default ChaynsEditor;
