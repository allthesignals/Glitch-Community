import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pickBy } from 'lodash';
import { VisuallyHidden } from '@fogcreek/shared-components';

import useUniqueId from 'Hooks/use-unique-id';
import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';

import styles from './text-input.styl';

const TYPES = ['email', 'password', 'search', 'text'];

const InputPart = ({ children, className }) => <span className={classNames(styles.inputPart, className)}>{children}</span>;

const TextInput = forwardRef(({
  autoFocus,
  className,
  disabled,
  error,
  labelText,
  maxLength,
  name,
  onChange,
  onBlur,
  onFocus,
  opaque,
  placeholder,
  postfix,
  prefix,
  testingId,
  type,
  value,
  ...props
}, ref) => {
  const uniqueId = useUniqueId();
  const outerClassName = classNames(className, styles.outer);
  const borderClassName = classNames(styles.inputBorder, {
    [styles.underline]: !opaque,
    [styles.opaque]: opaque,
  });
  const inputClassName = classNames(styles.inputPart, styles.input, {
    [styles.search]: type === 'search',
  });
  const eventProps = pickBy(props, (_, key) => key.startsWith('on'));
  return (
    <label className={outerClassName} htmlFor={uniqueId}>
      <VisuallyHidden>{labelText}</VisuallyHidden>
      <span className={borderClassName}>
        {!!prefix && <InputPart>{prefix}</InputPart>}
        <input
          {...eventProps}
          ref={ref}
          autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
          className={inputClassName}
          disabled={disabled}
          id={uniqueId}
          data-cy={testingId}
          maxLength={maxLength}
          name={name}
          onChange={(evt) => onChange(evt.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          type={type}
          value={value}
          spellCheck={type !== 'email' && type !== 'password'}
        />
        {!!error && (
          <InputPart className={styles.errorIcon}>
            <InputErrorIcon />
          </InputPart>
        )}
        {!!postfix && <InputPart>{postfix}</InputPart>}
      </span>
      {!!error && <InputErrorMessage>{error}</InputErrorMessage>}
    </label>
  );
});

TextInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  labelText: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  testingId: PropTypes.string,
  type: PropTypes.oneOf(TYPES),
  value: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
  autoFocus: false,
  className: '',
  disabled: false,
  error: null,
  maxLength: undefined,
  name: undefined,
  onBlur: undefined,
  onFocus: undefined,
  opaque: false,
  placeholder: undefined,
  postfix: null,
  prefix: null,
  testingId: undefined,
  type: 'text',
};

export default TextInput;
