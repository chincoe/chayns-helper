import React, {
    FunctionComponent, ReactNode, Suspense, useEffect
} from 'react';
import showWaitCursor from '../../functions/waitCursor';
import CenteredWaitCursor from './CenteredWaitCursor';

const SuspenseWaitCursorFallback: FunctionComponent<{
    inline?: boolean;
}> = ({ inline = false }) => {
    useEffect(() => {
        if (!inline) {
            return showWaitCursor({ action: 'Suspense for React.lazy' });
        }
        return () => null;
    }, []);
    return inline ? (<CenteredWaitCursor className="Suspense_placeholder"/>) : (
        <div className="Suspense_placeholder"/>);
};

/**
 * SuspenseWaitCursor
 * A suspense component for lazy loading with React.lazy() that displays a waitCursor during the dynamic import.
 * The waitCursor can either be a <SmallWaitCursor/> (inline = true) or a chayns.showWaitCursor (inline = false)
 * @param props
 * @param props.children
 * @param [props.inline=false] - true: Small inline waitCursor; false: Big chayns overlay waitCursor
 * @constructor
 */
const SuspenseWaitCursor: FunctionComponent<{
    inline?: boolean;
    children: ReactNode;
}> = ({ children, inline = false }) => (
    <Suspense fallback={(<SuspenseWaitCursorFallback inline={inline}/>)}>
        {children}
    </Suspense>
);

SuspenseWaitCursor.displayName = 'SuspenseWaitCursor';

export default SuspenseWaitCursor;
