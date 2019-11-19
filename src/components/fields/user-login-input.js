import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';
import styles from './user-login-input.styl'

const UserLoginInput = ({ login, onChange }) => (
  <OptimisticTextInput
    label="User Login"
    value={login}
    onChange={onChange}
    placeholder="Nickname?"
    prefix="@"
    className={styles.userLoginInput}
    style={{ fontWeight: 'bold' }}
  />
);


UserLoginInput.propTypes = {
  login: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UserLoginInput;
