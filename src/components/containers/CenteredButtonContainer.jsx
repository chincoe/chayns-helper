import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './containers.scss';
import useElementProps from '../../hooks/useElementProps';

/**
 * CenteredButtonContainer
 * Contains and centers one or more children - usually buttons - with a margin between them
 * @param {Object} props
 * @param {*|*[]} props.children
 * @param {Object} [props.style={}]
 * @param {string} [props.className='']
 * @param {string} [props.elementType='div'] - Html element type of the container
 * @return {*}
 * @constructor
 */
const CenteredButtonContainer = (props) => {
    const {
        className, style, children, elementType = 'div'
    } = props;
    const elementProps = useElementProps(props, {
        className, style, children, elementType
    });
    const Component = elementType;
    return (
        <Component
            {...elementProps}
            className={classNames(
                'chayns__utils__container',
                'chayns__utils__container--centered',
                'chayns__utils__container--centered-buttoncontainer',
                className
            )}
            style={style}
        >
            {children}
        </Component>
    );
};
CenteredButtonContainer.propTypes = {
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    className: PropTypes.string,
    elementType: PropTypes.elementType
};
CenteredButtonContainer.defaultProps = {
    style: {},
    className: '',
    elementType: 'div'
};

CenteredButtonContainer.displayName = 'CenteredButtonContainer';

export default CenteredButtonContainer;
