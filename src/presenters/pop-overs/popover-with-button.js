import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container';

const PopoverWithButton = ({ dataTrack, containerClass, buttonClass, buttonText, children: renderChildren, onShow }) => (
  <PopoverContainer onShow={onShow}>
    {({ visible, togglePopover }) => (
      <div className={`button-wrap ${containerClass}`}>
        <button className={buttonClass} data-track={dataTrack} onClick={togglePopover} type="button">
          {buttonText}
        </button>
        {visible && renderChildren({ togglePopover })}
      </div>
    )}
  </PopoverContainer>
);

PopoverWithButton.propTypes = {
  buttonClass: PropTypes.string,
  containerClass: PropTypes.string,
  dataTrack: PropTypes.string,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
  onShow: PropTypes.func,
};

PopoverWithButton.defaultProps = {
  buttonClass: '',
  containerClass: '',
  dataTrack: '',
  onShow: null,
};

export default PopoverWithButton;
