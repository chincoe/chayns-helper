import React from 'react';
import PropTypes from 'prop-types';
import './error-boundary.scss';
import { Button } from 'chayns-components';
import CenteredButtonContainer from '../containers/CenteredButtonContainer';
import { chaynsHelperConfig } from '../../chaynsHelperConfig';

/**
 * An error-boundary.
 * Wrap your application in this. If an error occurs during render that causes react to fail rendering, this component
 * will catch the error, log it and display a fallback instead. The default fallback is a warning content card with a
 * generic error message, error details and reload button.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        chaynsHelperConfig.getLogger().error({
            message: '[error-boundary] Unexpected react error',
            data: { errorInfo }
        }, error);
    }

    render() {
        const { state, props } = this;
        const { children, fallback } = props;
        const FallbackComponent = fallback;
        if (state.hasError) {
            // You can render any custom fallback UI
            return fallback ? (
                <div className="ErrorBoundary">
                    <div className="ErrorBoundary__content__card content__card content__card--warning">
                        <h2>Es ist ein Fehler aufgetreten</h2>
                        <p>Wir sind bereits davon informiert und beheben den Fehler so schnell wie möglich.</p>
                        <p>
                            {`Fehler: ${state.error.toString()}`}
                        </p>
                        <CenteredButtonContainer>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        hasError: false,
                                        error: null
                                    });
                                }}
                            >
                                Nochmal versuchen
                            </Button>
                            <Button onClick={() => {
                                chayns.appendUrlParameter({ nocache: true }, true);
                                // eslint-disable-next-line no-restricted-globals
                                location.reload();
                            }}
                            >
                                Neu Laden
                            </Button>
                        </CenteredButtonContainer>
                    </div>
                </div>
            ) : (
                       <FallbackComponent error={state.error}/>
                   );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    fallback: PropTypes.func
};

ErrorBoundary.defaultProps = {
    fallback: null
};

ErrorBoundary.displayName = 'ErrorBoundary';

export default ErrorBoundary;
