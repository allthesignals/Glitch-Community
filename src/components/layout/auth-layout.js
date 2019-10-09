import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Logo from 'Components/header/logo';

import styles from './auth-layout.styl';

const AuthLayout = ({ children }) => (
  <div className={styles.layout}>
    <div className={styles.logo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    {children}
  </div>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
