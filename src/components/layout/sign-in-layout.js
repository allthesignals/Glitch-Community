import React, { useState } from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import TransparentButton from 'Components/buttons/transparent-button';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import Image from 'Components/images/image';
import TwoFactorForm from 'Components/sign-in/two-factor-form';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';

import MultiPageOverlay from './multi-page';
import styles from './sign-in-layout.styl';
import { emoji } from '../global.styl';

const magicImageUrl = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fmagic-link.svg?v=1568658265397';
const brainFriendsUrl = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fbrainfriends.svg?v=1568814632916';
const thumbprintUrl = 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2F2fa.svg?v=1568309705782';

const MagicHat = () => <Image width={92} src={magicImageUrl} alt="Get a magic code" />;
const BrainFriends = () => <Image width={92} src={brainFriendsUrl} alt="" />;
const Thumbprint = () => <Image width={92} src={thumbprintUrl} alt="" />;

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const pages = {
  signIn: {
    title: 'Sign In',
    content: (setPage) => (
      <div>
        <div className={styles.main}>
          <div className={styles.signInButtons}>
            {companyNames.map((companyName) => (
              <div key={companyName} className={styles.signInButton}>
                <SignInButton short companyName={companyName} />
              </div>
            ))}
          </div>
          <Button onClick={() => setPage('getCode')}>
            Email Magic Link <Icon className={emoji} icon="loveLetter" />
          </Button>
        </div>
        <TermsAndConditions />
        <Text className={styles.accountCreationHelpText}>Don't have an account?</Text>
        <Button onClick={() => setPage('createAccount')}>Create an account</Button>
      </div>
    ),
  },
  createAccount: {
    title: 'Create an Account',
    content: (setPage) => (
      <div>
        <div className={styles.main}>
          <Text className={styles.accountCreationIntroText}>Almost there! How do you want to sign up?</Text>
          <div className={styles.signInButtons}>
            {companyNames.map((companyName) => (
              <div key={companyName} className={styles.signInButton}>
                <SignInButton short companyName={companyName} />
              </div>
            ))}
          </div>
          <Button onClick={() => setPage('getCode')}>
            Email Magic Link <Icon className={emoji} icon="loveLetter" />
          </Button>
        </div>
        <div className={styles.footer}>
          <TermsAndConditions />
          <BrainFriends />
        </div>
        <Text className={styles.accountCreationHelpText}>Already have an account?</Text>
        <Button onClick={() => setPage('signIn')}>Sign In</Button>
      </div>
    ),
  },
  getCode: {
    title: 'Magic Code',
    content: (setPage) => (
      <div>
        <GetMagicCode
          onCodeSent={({ emailAddress }) => {
            setPage('useCode', emailAddress);
          }}
        />
        <div className={styles.footer}>
          <MagicHat />
        </div>
      </div>
    ),
  },
  useCode: {
    title: 'Magic Code',
    content: (setPage) => (
      <div>
        <UseMagicCode emailAddress={email} showTwoFactorPage={() => setPage('2fa')} />
        <div className={styles.footer}>
          <TermsAndConditions />
          <MagicHat />
        </div>
      </div>
    ),
  },
};

const SignInLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <MultiPageOverlay defaultPage="2fa">
        {({ page, setPage, goBack }) => {
          return (
            <div className={styles.overlay}>
              {page === '2fa' && (
                <>
                  <section className={styles.title}>
                    <TransparentButton onClick={goBack}>
                      <div className={styles.magicCode}>
                        <span className={styles.backArrow}>
                          <Icon icon="chevronLeft" />
                        </span>
                        <Heading tagName="h1">Two Factor Authentication</Heading>
                      </div>
                    </TransparentButton>
                  </section>
                  <section className={styles.content}>
                    <div>
                      <TwoFactorForm initialToken="olivia" />
                      <div className={styles.footer}>
                        <TermsAndConditions />
                        <Thumbprint />
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          );
        }}
      </MultiPageOverlay>
    </div>
  );
};

export default SignInLayout;
