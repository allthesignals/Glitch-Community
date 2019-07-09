import React from 'react';
import classNames from 'classnames';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import PasswordLogin from 'Components/sign-in/password-login';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';

import styles from './sign-in-layout.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const SignInButtons = () => (
  <div className={styles.signInButtons}>
    {companyNames.map((companyName) => (
      <div key={companyName} className={styles.signInButton}><SignInButton short companyName={companyName} /></div>
    ))}
  </div>
);

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const SignInLayout = () => (
  <div className={styles.layout}>
    <div className={styles.logo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    <div className={styles.overlay}>
      <section className={styles.titleSection}>
        <h1>Sign In</h1>
      </section>
      <section className={styles.section}>
        <div className={styles.content}>
          <div className={styles.oauthSection}>
            <SignInButtons />
            <TermsAndConditions />
          </div>
          <div className={styles.passwordSection}>
            <div className={styles.keyImage}>
              <Image src={keyImageUrl} alt="Door and key illustration"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default SignInLayout;
