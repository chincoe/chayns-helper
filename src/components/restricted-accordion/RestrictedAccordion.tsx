import React, {FunctionComponent, ReactChildren} from 'react';
// @ts-ignore
import { Accordion, Icon } from 'chayns-components';
import clsx from 'clsx';
import './restricted-accordion.scss';

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

RestrictedAccordion.displayName = 'RestrictedAccordion';

export default RestrictedAccordion;
