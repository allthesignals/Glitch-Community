import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './button-with-emoji.styl'
import Button, { TYPES, SIZES } from './button'

/**
 * Button Component
 */
const ButtonWithEmoji = ({ onClick, disabled, type, size, emoji, children }) => {
  return (
    <div className={styles.buttonWithEmoji}>
      <Button onClick={onClick} type={type} size={size}>
        {children}
        <img className={styles.emoji} src={emoji}></img>
      </Button>
    </div>
  )
}

ButtonWithEmoji.propTypes = {
  /** callback when button clicked */
  onClick: PropTypes.func,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.string,
  /** full url for emoji image */
  emoji: PropTypes.string.isRequired
};

export default ButtonWithEmoji