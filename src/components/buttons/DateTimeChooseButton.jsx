import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ChooseButton } from 'chayns-components';
import useElementProps from '../../hooks/useElementProps';
import { formatDate, time } from '../../functions/timeHelper';
import T from '../../functions/types';

/**
 * DateTimeChooseButton
 * choose date and time
 * handles that the dialog uses seconds not ms for timestamps
 * doesn't support multiselect
 * @param {Object} props
 * @param {string} [props.className]
 * @param {Date} props.date - Current value
 * @param {function(Date)} props.onChange - receives new Date as parameter
 * @param {Object} props.parameters - additional parameters for the date dialog
 * @param {string} props.parameters.title
 * @param {string} props.parameters.message
 * @param {Object[]} props.parameters.buttons
 * @param {Date|function} props.parameters.minDate - minDate or a function that returns the minDate
 * @param {Date} props.parameters.maxDate
 * @param {number} props.parameters.minuteInterval
 * @param {number} props.parameters.preSelect
 * @param {Date[]} props.parameters.disabledDates
 * @param {boolean} props.parameters.yearSelect
 * @param {boolean} props.parameters.monthSelect
 * @param {Object[]}props.parameters.disabledIntervals
 * @public
 * @return {*}
 * @constructor
 */
const DateTimeChooseButton = (props) => {
    const {
        date, onChange, parameters, className
    } = props;

    const roundedDate = useMemo(() => {
        const interval = !T.isNullOrEmpty(parameters)
                         && !T.isNullOrEmpty(parameters.minuteInterval)
                         // eslint-disable-next-line react/prop-types
                         && T.isCleanNumber(parameters.minuteInterval) ? parameters.minuteInterval : 15;
        const rounded = Math.round(new Date(date).getTime() / (interval * time.minute));
        return new Date(rounded * time.minute * interval);
    }, [date]);

    useEffect(() => {
        onChange(roundedDate);
    }, []);

    const handleClick = async () => {
        const { buttonType, selectedDates } = await chayns.dialog.advancedDate({
            preSelect: roundedDate,
            message: 'Wähle ein Datum',
            dateType: chayns.dialog.dateType.DATE_TIME,
            minuteInterval: 15,
            minDate: T.isFunction(parameters.minDate) ? parameters.minDate() : parameters.minDate,
            ...parameters
        });

        if (buttonType > 0) {
            const dateInSeconds = selectedDates[0].timestamp;
            const newDate = new Date(dateInSeconds * time.second);
            onChange(newDate);
        }
    };

    const elementProps = useElementProps(props, {
        date,
        onChange,
        parameters,
        className
    });

    return (
        <ChooseButton
            {...elementProps}
            onClick={handleClick}
            className={classNames('DateTimeChooseButton', className)}
        >
            {formatDate(roundedDate)}
        </ChooseButton>
    );
};

DateTimeChooseButton.propTypes = {
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    parameters: PropTypes.shape({
        title: PropTypes.string,
        message: PropTypes.string,
        buttons: PropTypes.arrayOf(PropTypes.object),
        minDate: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Date)]),
        maxDate: PropTypes.instanceOf(Date),
        minuteInterval: PropTypes.number,
        preSelect: PropTypes.instanceOf(Date),
        disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
        yearSelect: PropTypes.bool,
        monthSelect: PropTypes.bool,
        disabledIntervals: PropTypes.arrayOf(PropTypes.object),
    })
};

DateTimeChooseButton.defaultProps = {
    parameters: {},
    className: ''
};

DateTimeChooseButton.displayName = 'DateTimeChooseButton';

export default DateTimeChooseButton;
