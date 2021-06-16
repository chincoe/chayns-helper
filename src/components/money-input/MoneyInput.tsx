import React, {
    useState, useEffect, FunctionComponent, useMemo, ReactNode
} from 'react';
import { Input, TextString } from 'chayns-components';
import useUniqueTimeout from '../../hooks/uniques/useUniqueTimeout';
import useUpdateEffect from '../../hooks/useUpdateEffect';

export interface MoneyInputProps {
    value: number;
    onChange: (value: number) => void;
    showInvalid: boolean;
    timeout: number;
    minValue: number;
    maxValue: number;
}

export interface InputProps {
    className: string;
    onKeyUp: (...args: unknown[]) => void;
    onKeyDown: (...args: unknown[]) => void;
    onEnter: (...args: unknown[]) => void;
    // onChange: (...args: unknown[]) => void;
    onBlur: (...args: unknown[]) => void;
    onFocus: (...args: unknown[]) => void;
    regExp: RegExp;
    style: CSSStyleDeclaration & Record<string | keyof CSSStyleDeclaration, number | string>;
    placeholder: string;
    // value: string | number;
    defaultValue: string | number;
    // invalid: boolean;
    type: string | 'text' | 'number'
    inputRef: (...args: unknown[]) => void;
    icon: string | unknown;
    onIconClick: (...args: unknown[]) => void;
    wrapperRef: (...args: unknown[]) => void;
    dynamic: boolean | number;
    customProps: unknown;
    id: string;
    stopPropagation: boolean;
    required: boolean;
    disabled: boolean;
    clearIcon: boolean;
    design: number;
    iconLeft: string | unknown;
    right: ReactNode;
    invalidMessage: string;
    emptyValue: string | number;
}

const validRegexDe = /^[0-9]+,?[0-9]{0,2}$/;
const validRegexEn = /^[0-9]+\.?[0-9]{0,2}$/;

const getValidRegex = (): RegExp => (TextString.language === 'de' ? validRegexDe : validRegexEn);

enum SeparatorType {
    Decimal,
    Thousand
}

const separator = (type: SeparatorType = SeparatorType.Decimal) => {
    if (TextString.language === 'de') {
        return type === SeparatorType.Decimal ? ',' : '.';
    }
    return type === SeparatorType.Decimal ? '.' : ',';
};

const convertToString = (value: number | null): string => {
    if (typeof value !== 'number') return '';
    const floatValue = value / 100;
    let result = `${Math.floor(floatValue)}`;
    result += separator(SeparatorType.Decimal);
    result += `00${Math.floor((floatValue * 100) % 100)}`.slice(-2);
    return result;
};

const convertToNumber = (input: string): number => {
    let value = input;
    value = value.replace(/,/g, '.');
    if (Number.isNaN(+value)) return 0;
    return Math.floor(+value * 100);
};

const isMoneyEqual = (current: string, prev: string): boolean => convertToNumber(current) === convertToNumber(prev);

const formatMoney = (input: string): string => convertToString(convertToNumber(input));

const MoneyInput: FunctionComponent<MoneyInputProps & Partial<InputProps>> = ({
    value, // integer cent value
    onChange,
    timeout = 0,
    showInvalid = false,
    minValue = 0,
    maxValue = undefined,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const initialValue = useMemo(
        () => convertToString(value ?? props.defaultValue ?? null), [value]
    );
    const isValid = (v: string | number): boolean => getValidRegex().test(`${v}`)
        && !Number.isNaN(+(`${v}`.replace(/,/g, '.')))
        && convertToNumber(`${v}`) >= minValue
        && (!maxValue || convertToNumber(`${v}`) <= maxValue);

    const [state, setState] = useState<string>(initialValue);
    const [previousState, setPreviousState] = useState<string>(initialValue);
    const [setStateTimeout] = useUniqueTimeout();

    useUpdateEffect(() => {
        if (convertToNumber(state) !== value) { setState(convertToString(value)); }
    }, [value]);

    useEffect(() => {
        if (isValid(state) && !isMoneyEqual(state, previousState)) {
            const t = setStateTimeout(() => {
                setPreviousState(state);
                onChange(convertToNumber(state));
            }, (timeout ?? 500));
            return () => {
                clearTimeout(t);
            };
        }
        return () => null;
    }, [state]);

    return (
        <Input
            placeholder="Euro"
            dynamic
            {...props}
            onFocus={(...v: unknown[]) => {
                setIsFocused(true);
                if (props.onFocus) props.onFocus(...v);
            }}
            onBlur={(...v: unknown[]) => {
                setIsFocused(false);
                if (props.onBlur) props.onBlur(...v);
                if (isValid(state)) {
                    setState(formatMoney(state));
                } // else if (!showInvalid) setState(initialValue);
            }}
            className={`money-input ${props.className || ''}`}
            value={state}
            onChange={(v: string) => {
                setState(v);
            }}
            invalid={(showInvalid || !isFocused) ? state !== '' && !isValid(state) : false}
        />
    );
};

MoneyInput.displayName = 'MoneyInput';

MoneyInput.propTypes = {};

MoneyInput.defaultProps = {};

export default MoneyInput;
