import React, {ErrorInfo, JSXElementConstructor, ReactChildren} from 'react';
import './error-boundary.scss';
// @ts-expect-error
import {Button} from 'chayns-components';
// @ts-expect-error
import logger from 'chayns-logger';
import CenteredContainer from '../containers/CenteredContainer';

/**
 * An ErrorBoundary.
 * Wrap your application in this. If an error occurs during render that causes react to fail rendering, this component
 * will catch the error, log it and display a fallback instead. The default fallback is a warning content card with a
 * generic error message, error details and reload button.
 */
class ErrorBoundary extends React.Component<{
    children: ReactChildren,
    fallback?: JSXElementConstructor<any>
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    /*#__PURE__*/static getDerivedStateFromError(error: Error) {
        // eslint-disable-next-line no-console
        console.error(error);
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        logger.error({
            message: '[ErrorBoundary] Unexpected react error',
            data: {errorInfo}
        }, error);
    }

    render() {
        const {state, props} = this;
        const {children, fallback} = props;
        const FallbackComponent = fallback;
        // @ts-expect-error
        if (state.hasError) {
            // You can render any custom fallback UI
            return fallback
                // @ts-expect-error
                ? (<FallbackComponent error={state.error}/>)
                : (
                    <div className="ErrorBoundary">
                        <div className="ErrorBoundary__content__card content__card content__card--warning">
                            <h2>Es ist ein Fehler aufgetreten</h2>
                            <p>Wir sind bereits davon informiert und beheben den Fehler so schnell wie möglich.</p>
                            {process.env.NODE_ENV === 'development' && (
                                <p>
                                    {/* @ts-expect-error */}
                                    {`Fehler: ${state.error.toString()}`}
                                </p>
                            )}
                            <CenteredContainer style={{}}>
                                <Button
                                    onClick={() => {
                                        chayns.appendUrlParameter({nocache: true}, true);
                                        // eslint-disable-next-line no-restricted-globals
                                        location.reload();
                                    }}
                                >
                                    Neu Laden
                                </Button>
                            </CenteredContainer>
                        </div>
                    </div>
                );
        }

        return children;
    }
}

export default ErrorBoundary;
