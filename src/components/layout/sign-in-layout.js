import React, { useState } from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import TransparentButton from 'Components/buttons/transparent-button';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import Image from 'Components/images/image';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';
import SignInWithPassword from 'Components/sign-in/sign-in-with-password';
import ForgotPassword from 'Components/sign-in/forgot-password';
import Text from 'Components/text/text';
import useDevToggle from 'State/dev-toggles';

import styles from './sign-in-layout.styl';
import { emoji } from '../global.styl';

const magicImageUrl = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fmagic-link.svg?v=1568658265397';
const brainFriendsUrl = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fbrainfriends.svg?v=1568814632916';

const MagicHat = () => <Image width={92} src={magicImageUrl} alt="Get a magic code" />;
const BrainFriends = () => <Image width={92} src={brainFriendsUrl} alt="" />;

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const SignInLayout = () => {
  const [page, setPage] = useState('main');
  const [email, setEmail] = useState();
  const showMainPage = () => setPage('main');
  const showGetCodePage = () => setPage('getCode');
  const showUseCodePage = () => setPage('useCode');
  const showCreateAccountPage = () => setPage('createAccount');
  const showUsePasswordPage = () => setPage('usePassword');
  const showForgotPasswordPage = () => setPage('forgotPassword');
  const userPasswordsEnabled = useDevToggle('User Passwords');

  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className={styles.overlay}>
        <section className={styles.title}>
          {page === 'main' && <h1>Sign In</h1>}
          {page === 'createAccount' && <h1>Create an Account</h1>}
          {page === 'getCode' && (
            <TransparentButton onClick={showMainPage}>
              <div className={styles.magicCode}>
                <span className={styles.backArrow}>
                  <Icon icon="chevronLeft" />
                </span>
                <h1>Magic Code</h1>
              </div>
            </TransparentButton>
          )}
          {page === 'useCode' && (
            <TransparentButton
              onClick={() => {
                setEmail(null);
                showGetCodePage();
              }}
            >
              <div className={styles.magicCode}>
                <span className={styles.backArrow}>
                  <span className="left-arrow icon" />
                </span>
                <h1>Magic Code</h1>
              </div>
            </TransparentButton>
          )}
          {page === 'usePassword' && (
            <TransparentButton onClick={showMainPage}>
              <div className={styles.magicCode}>
                <span className={styles.backArrow}>
                  <Icon icon="chevronLeft" />
                </span>
                <h1>Sign in With Password</h1>
              </div>
            </TransparentButton>
          )}
          {page === 'forgotPassword' && (
            <TransparentButton onClick={showMainPage}>
              <div className={styles.magicCode}>
                <span className={styles.backArrow}>
                  <Icon icon="chevronLeft" />
                </span>
                <h1>Forgot Password</h1>
              </div>
            </TransparentButton>
          )}
        </section>
        <section className={styles.content}>
          {page === 'main' && (
            <div>
              <div className={styles.main}>
                <div className={styles.signInButtons}>
                  {companyNames.map((companyName) => (
                    <div key={companyName} className={styles.signInButton}>
                      <SignInButton short companyName={companyName} />
                    </div>
                  ))}
                </div>
                <div className={styles.signInWithGlitchButtons}>
                  <Button onClick={showGetCodePage}>
                    Email Magic Link <Icon className={emoji} icon="loveLetter" />
                  </Button>
                  {userPasswordsEnabled && (
                    <Button onClick={showUsePasswordPage}>
                    Password <Icon className={emoji} icon="key" />
                    </Button>
                  )}
                </div>
              </div>
              <TermsAndConditions />
              <Text className={styles.accountCreationHelpText}>Don't have an account?</Text>
              <Button onClick={showCreateAccountPage}>
                Create an account
              </Button>
            </div>
          )}
          {page === 'getCode' && (
            <div>
              <GetMagicCode
                onCodeSent={({ emailAddress }) => {
                  setEmail(emailAddress);
                  showUseCodePage();
                }}
              />
              <div className={styles.footer}>
                <MagicHat />
              </div>
            </div>
          )}
          {page === 'useCode' && (
            <div>
              <UseMagicCode emailAddress={email} />
              <div className={styles.footer}>
                <TermsAndConditions />
                <MagicHat />
              </div>
            </div>
          )}
          {page === 'createAccount' && (
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
                <Button onClick={showGetCodePage}>
                  Email Magic Link <Icon className={emoji} icon="loveLetter" />
                </Button>
              </div>
              <div className={styles.footer}>
                <TermsAndConditions />
                <BrainFriends />
              </div>
              <Text className={styles.accountCreationHelpText}>Already have an account?</Text>
              <Button onClick={showMainPage}>
                Sign In
              </Button>
            </div>
          )}
          {page === 'usePassword' && (
            <div>
              <SignInWithPassword showForgotPasswordPage={showForgotPasswordPage} />
              <div className={styles.footer}>
                <TermsAndConditions />
              </div>
            </div>
          )}
          {page === 'forgotPassword' && <ForgotPassword showMainPage={showMainPage} />}
        </section>
      </div>
    </div>
  );
};

export default SignInLayout;
