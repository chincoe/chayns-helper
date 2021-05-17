import React, {
    ErrorInfo, FunctionComponent, JSXElementConstructor, ReactNode
} from 'react';
import './error-boundary.scss';
import { Button } from 'chayns-components';
import logger from '../../utils/requireChaynsLogger';
import CenteredContainer from '../containers/CenteredContainer';

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: JSXElementConstructor<{ error?: Error, clearError?: () => void }>;
}

export type ErrorBoundaryState = { error?: Error | null; hasError: boolean }

/**
 * An ErrorBoundary.
 * Wrap your application in this. If an error occurs during render that causes react to fail rendering, this component
 * will catch the error, log it and display a fallback instead. Its logs will be able to show your, in which component
 * the error occurred. The default fallback is a warning content card with a generic error message, error details and
 * reload button.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    /* #__PURE__ */
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // eslint-disable-next-line no-console
        console.error(error);
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error
        };
    }

    static wrap(
        WrappedComponent: JSXElementConstructor<unknown>,
        fallback?: JSXElementConstructor<{ error?: Error, clearError?: () => void }>
    ): FunctionComponent<unknown> {
        return (props: Record<string, unknown>) => (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props}/>
            </ErrorBoundary>
        );
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can also log the error to an error reporting service
        logger.error({
            message: '[ErrorBoundary] Unexpected react error',
            data: { errorInfo }
        }, error);
    }

    render(): ReactNode {
        const {
            state,
            props
        } = this;
        const {
            children,
            fallback
        } = props;
        // noinspection UnnecessaryLocalVariableJS
        const FallbackComponent = fallback;
        if (state.hasError) {
            // You can render any custom fallback UI
            return FallbackComponent
                ? (
                    <FallbackComponent
                        error={state.error as Error}
                        clearError={() => { this.setState({ hasError: false }); }}
                    />
                )
                : (
                    <div className="ErrorBoundary">
                        <p>
                            Es ist ein Fehler aufgetreten. Wir sind bereits davon informiert und beheben den Fehler so
                            schnell wie möglich.
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <p>
                                {`Fehler: ${(state.error as Error).toString()}`}
                            </p>
                        )}
                        <CenteredContainer>
                            <Button
                                onClick={() => {
                                    chayns.appendUrlParameter({ nocache: true }, true);
                                    window.location.reload();
                                }}
                            >
                                Neu Laden
                            </Button>
                        </CenteredContainer>
                    </div>
                );
        }

        return children;
    }
}

export default ErrorBoundary;
