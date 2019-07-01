import React, { useState, useEffect, useMemo, createContext } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

// statuses: 'closed' | 'openedFromKeyboard' | 'openedFromClick'
const usePopoverToggle = ({ startOpen, onOpen }) => {
  console.log({ startOpen, onOpen })
  const [status, setStatus] = useState(startOpen ? 'openedFromKeyboard' : 'closed');
  console.log("new status", status)
  const openPopover = (event) => {
    console.log("openPopover called")
    if (event && event.detail === 0) {
      setStatus('openedFromKeyboard');
    } else {
      setStatus('openedFromClick');
    }
    if (onOpen) {
      onOpen();
    }
  };
  const closePopover = () => {
    console.log("closePopover called")
    setStatus('closed');
  }

  const togglePopover = (event) => {
    console.log("togglePopover called")
    if (status === 'closed') {
      openPopover(event);
    } else {
      closePopover();
    }
  };

  const toggleAndCall = (func) => {
    if (!func) return null;
    return (...args) => {
      togglePopover();
      return func(...args);
    };
  };

  useEffect(() => {
    if (status === 'closed') return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setStatus('closed');
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [status]);

  return useMemo(
    () => ({
      status,
      visible: status !== 'closed',
      setStatus,
      openPopover,
      closePopover,
      togglePopover,
      toggleAndCall,
    }),
    [status],
  );
};

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

export const PopoverToggleContext = createContext(null);

const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {  
  const toggleState = usePopoverToggle({ startOpen, onOpen });

  const inner = children(toggleState);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(toggleState) : null;
  return (
    <PopoverToggleContext.Provider value={toggleState}>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={toggleState.closePopover}>
        {inner}
      </MonitoredComponent>
    </PopoverToggleContext.Provider>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  onOpen: null,
  outer: null,
  startOpen: false,
};

export default PopoverContainer;
