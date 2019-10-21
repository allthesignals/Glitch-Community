import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@fogcreek/shared-components';
import TransparentButton from 'Components/buttons/transparent-button';
import styles from './overlays.styl';

export const Overlay = ({ children, className, ariaModal, ariaLabelledBy }) => {
  const overlayClass = classNames(styles.overlay, className);
  return (
    <dialog className={overlayClass} open aria-modal={ariaModal} aria-labelledby={ariaLabelledBy}>
      {children}
    </dialog>
  );
};
Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  ariaModal: PropTypes.bool,
};
Overlay.defaultProps = {
  className: null,
  ariaLabelledBy: '',
  ariaModal: false,
};

export const OverlaySection = ({ children, type }) => {
  const sectionClass = classNames(styles.section, styles[type]);
  return <section className={sectionClass}>{children}</section>;
};
OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export const OverlayTitle = ({ children, id, goBack }) => {
  if (goBack) {
    return (
      <TransparentButton onClick={goBack}>
        <div className={styles.goBack}>
          <span>
            <Icon icon="chevronLeft" />
          </span>
          <h1 className={styles.title} id={id}>
            {children}
          </h1>
        </div>
      </TransparentButton>
    );
  }

  return (
    <h1 className={styles.title} id={id}>
      {children}
    </h1>
  );
};

OverlayTitle.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  goBack: PropTypes.func,
};
OverlayTitle.defaultProps = {
  id: '', // for aria labelled by purposes only
  goBack: undefined,
};

export const OverlayBackground = () => <div className={styles.overlayBackground} role="presentation" tabIndex={-1} />;
