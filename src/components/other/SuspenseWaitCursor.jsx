import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { showWaitCursor } from '../../functions/waitCursor';
import CenteredWaitCursor from '../containers/CenteredWaitCursor';

/**
 * SuspenseWaitCursor
 * A suspense component for lazy loading with React.lazy() that displays a waitCursor during the dynamic import.
 * The waitCursor can either be a <SmallWaitCursor/> (inline = true) or a chayns.showWaitCursor (inline = false)
 * @param {Object} props
 * @param {*|*[]} props.children
 * @param {boolean} [props.inline=false] - true: Small inline waitCursor; false: Big chayns overlay waitCursor
 * @return {*}
 * @constructor
 */
const SuspenseWaitCursor = ({ children, inline = false }) => (
    <Suspense fallback={(<SuspenseWaitCursorFallback inline={inline}/>)}>
        {children}
    </Suspense>
);

SuspenseWaitCursor.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    inline: PropTypes.bool
};

SuspenseWaitCursor.defaultProps = {
    inline: false
};

SuspenseWaitCursor.displayName = 'SuspenseWaitCursor';

export default SuspenseWaitCursor;

const SuspenseWaitCursorFallback = ({ inline = false }) => {
    useEffect(() => {
        if (!inline) {
            return showWaitCursor();
        }
        return () => null;
    }, []);
    return inline ? (<CenteredWaitCursor className="Suspense_placeholder"/>) : (
        <div className="Suspense_placeholder"/>);
};

SuspenseWaitCursorFallback.displayName = 'SuspenseWaitCursorFallback';

SuspenseWaitCursorFallback.propTypes = {
    inline: PropTypes.bool
};

SuspenseWaitCursorFallback.defaultProps = {
    inline: false
};
