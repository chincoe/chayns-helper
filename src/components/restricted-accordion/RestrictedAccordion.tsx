import React, {FunctionComponent, ReactChildren} from 'react';
// @ts-expect-error
import { Accordion, Icon } from 'chayns-components';
import clsx from 'clsx';
import './restricted-accordion.scss';

/**
 * An Accordion styled for exclusive access by e.g. managers
 */
const RestrictedAccordion: FunctionComponent<{
    className: string,
    children: ReactChildren,
    onSearch?: (value: string) => any;
    onSearchEnter?: (value: string) => any;
    useAdminStyle?: boolean
}> = (
    {
        className,
        children,
        onSearch,
        onSearchEnter,
        useAdminStyle = true,
        ...props
    }
) => (
    <Accordion
        right={!(useAdminStyle === false) ? (<Icon icon="fas fa-lock"/>) : null}
        {...props}
        className={clsx(
            { 'accordion--restricted': !(useAdminStyle === false) },
            { 'accordion--restricted-search': onSearch || onSearchEnter },
            className
        )}
    >
        {children}
    </Accordion>
);

export default RestrictedAccordion;
