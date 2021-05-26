import React, { FunctionComponent, ReactNode } from 'react';
import { Accordion, Icon } from 'chayns-components';
import clsx from 'clsx';
import './restricted-accordion.scss';

export interface RestrictedAccordionProps {
    className?: string;
    head: ReactNode | string;
    children: ReactNode;
    onSearch?: (value: string) => unknown;
    onSearchEnter?: (value: string) => unknown;
    useAdminStyle?: boolean;
}

/**
 * An Accordion styled for exclusive access by e.g. managers
 */
const RestrictedAccordion: FunctionComponent<RestrictedAccordionProps> = (
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
