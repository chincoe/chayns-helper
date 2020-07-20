import logger from 'chayns-logger';

/**
 * Default error handler for failed httpRequests
 * @param {Error|RequestError} err
 */
const handleRequestErrors = (err) => {
    (async () => {
        switch (err.statusCode) {
            case -1:
                break;
            case 400:
                await chayns.dialog.alert('', 'Anfrage fehlgeschlagen. Bitte überprüfe deine Eingaben.');
                break;
            case 401:
                if (!chayns.env.user.isAuthenticated) chayns.login();
                else chayns.refreshAccessToken();
                break;
            case 403:
                await chayns.dialog.alert('', 'Du has keine Berechtigungen für diesen Zugriff.');
                break;
            case 404:
                await chayns.dialog.alert('', 'Die angefragte Ressource ist zur Zeit nicht verfügbar.');
                break;
            case 500:
                await chayns.dialog.alert('', 'Ein unerwarteter Fehler ist aufgetreten. Wir werden das bei nächster Gelegenheit beheben. Versuche es später nochmal.');
                break;
            case 503:
                await chayns.dialog.alert('', 'Unsere Server sind zur Zeit nicht erreichbar. Bitte versuche es später noch einmal.');
                break;
            default:
                logger.critical({
                    message: 'Unknown request error occurred',
                    data: err,
                    section: 'useErrorHandler.js'
                }, err);
        }
    })();
};

export default handleRequestErrors;
