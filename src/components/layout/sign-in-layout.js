import React, { useState } from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Link from 'Components/link';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import { Overlay, OverlayTitle, OverlaySection } from 'Components/overlays';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import TwoFactorForm from 'Components/sign-in/two-factor-form';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';
import AuthLayout from 'Components/layout/auth-layout';

import MultiPage from './multi-page';
import styles from './sign-in-layout.styl';
import { emoji } from '../global.styl';

const SignInButtons = () => (
  <div className={styles.signInButtons}>
    {companyNames.map((companyName) => (
      <SignInButton short companyName={companyName} key={companyName} />
    ))}
  </div>
);

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const MagicHat = () => <Image width={92} src="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fmagic-link.svg?v=1568658265397" alt="" />;
const Thumbprint = () => <Image width={92} src="https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2F2fa.svg?v=1568309705782" alt="" />;
const BrainFriends = () => (
  <Image width={92} src="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fbrainfriends.svg?v=1568814632916" alt="" />
);

const SignInLayout = () => {
  const [state, setState] = useState({ emailAddress: undefined, initialToken: undefined });
  return (
    <AuthLayout>
      <MultiPage defaultPage="signIn">
        {({ page, setPage, goBack }) => {
          return (
            <Overlay className={styles.overlay}>
              {page === 'signIn' && (
                <>
                  <OverlaySection type="info">
                    <OverlayTitle>Sign In</OverlayTitle>
                  </OverlaySection>
                  <OverlaySection type="actions">
                    <SignInButtons />
                    <Button onClick={() => setPage('getCode')}>
                      Email Magic Link <Icon className={emoji} icon="loveLetter" />
                    </Button>
                    <TermsAndConditions />
                    <Text className={styles.helpText}>Don't have an account?</Text>
                    <Button onClick={() => setPage('createAccount')}>Create an account</Button>
                  </OverlaySection>
                </>
              )}
              {page === 'createAccount' && (
                <>
                  <OverlaySection type="info">
                    <OverlayTitle goBack={goBack}>Create an Account</OverlayTitle>
                  </OverlaySection>
                  <OverlaySection type="actions">
                    <Text className={styles.helpText}>Almost there! How do you want to sign up?</Text>
                    <SignInButtons />
                    <Button onClick={() => setPage('getCode')}>
                      Email Magic Link <Icon className={emoji} icon="loveLetter" />
                    </Button>
                    <div className={styles.footer}>
                      <TermsAndConditions />
                      <BrainFriends />
                    </div>
                    <Text className={styles.helpText}>Already have an account?</Text>
                    <Button onClick={() => setPage('signIn')}>Sign In</Button>
                  </OverlaySection>
                </>
              )}
              {page === 'getCode' && (
                <>
                  <OverlaySection type="info">
                    <OverlayTitle goBack={goBack}>Magic Code</OverlayTitle>
                  </OverlaySection>
                  <OverlaySection type="actions">
                    <GetMagicCode
                      onCodeSent={({ emailAddress }) => {
                        setState({ ...state, emailAddress });
                        setPage('useCode');
                      }}
                    />
                    <div className={styles.footer}>
                      <MagicHat />
                    </div>
                  </OverlaySection>
                </>
              )}
              {page === 'useCode' && (
                <>
                  <OverlaySection type="info">
                    <OverlayTitle goBack={goBack}>Magic Code</OverlayTitle>
                  </OverlaySection>
                  <OverlaySection type="actions">
                    <UseMagicCode
                      emailAddress={state.emailAddress}
                      onTwoFactorChallenge={(initialToken) => {
                        setState({ ...state, initialToken });
                        setPage('2fa');
                      }}
                    />
                    <div className={styles.footer}>
                      <TermsAndConditions />
                      <MagicHat />
                    </div>
                  </OverlaySection>
                </>
              )}
              {page === '2fa' && (
                <>
                  <OverlaySection type="info">
                    <OverlayTitle goBack={goBack}>Two Factor Authentication</OverlayTitle>
                  </OverlaySection>
                  <OverlaySection type="actions">
                    <TwoFactorForm initialToken={initialToken} />
                    <div className={styles.footer}>
                      <TermsAndConditions />
                      <Thumbprint />
                    </div>
                  </OverlaySection>
                </>
              )}
            </Overlay>
          );
        }}
      </MultiPage>
    </AuthLayout>
  );
};

export default SignInLayout;
