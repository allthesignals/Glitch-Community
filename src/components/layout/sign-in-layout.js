-inimport React, { useState } from 'react';
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
import SignInWithPassword from 'Components/sign-in/sign-in-with-password';
import ForgotPassword from 'Components/sign-in/forgot-password';
import useDevToggle from 'State/dev-toggles';

import MultiPage from './multi-page';
import styles from './sign-in-layout.styl';
import { emoji } from '../global.styl';
import { DotsImg, PillsImg } from 'Components/sign-in/sign-in-masks';

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

const MagicHatImage = () => (
  <Image width={70} src="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fmagic-link.svg?v=1568658265397" alt="" />
);
const ThumbprintImage = () => <Image width={92} src="https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2F2fa.svg?v=1568309705782" alt="" />;
const CreateAccountImage = () => (
  <Image width={92} src="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fcreate-an-account.svg?v=1571162269523" alt="" />
);

const SignInLayout = () => {
  const [state, setState] = useState({ emailAddress: undefined, initialToken: undefined });
  const userPasswordsEnabled = useDevToggle('User Passwords');

  return (
    <div className={styles.signInBackground}>
      {/* Background Image Masks */}
      <DotsImg />
      <PillsImg />

      <AuthLayout>
        <MultiPage defaultPage="signIn">
          {({ page, setPage, goBack }) => (
            <>
              <Overlay className={styles.overlay}>
                {page === 'signIn' && (
                  <>
                    <OverlaySection type="info">
                      <OverlayTitle>Sign In to Glitch</OverlayTitle>
                    </OverlaySection>
                    <OverlaySection type="actions">
                      <SignInButtons />
                      <div className={styles.signInWithGlitchButtons}>
                        <Button size="small" onClick={() => setPage('getCode')}>
                          Email Magic Link <Icon className={emoji} icon="loveLetter" />
                        </Button>
                        {userPasswordsEnabled && (
                          <Button size="small" onClick={() => setPage('usePassword')}>
                            Password <Icon className={emoji} icon="key" />
                          </Button>
                        )}
                      </div>
                      <TermsAndConditions />
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
                      <Button size="small" onClick={() => setPage('getCode')}>
                        Email Magic Link <Icon className={emoji} icon="loveLetter" />
                      </Button>
                      <div className={styles.footer}>
                        <TermsAndConditions />
                        <CreateAccountImage />
                      </div>
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
                        <MagicHatImage />
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
                        showTwoFactorPage={(initialToken) => {
                          setState({ ...state, initialToken });
                          setPage('2fa');
                        }}
                      />
                      <div className={styles.footer}>
                        <TermsAndConditions />
                        <MagicHatImage />
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
                      <TwoFactorForm initialToken={state.initialToken} />
                      <div className={styles.footer}>
                        <TermsAndConditions />
                        <ThumbprintImage />
                      </div>
                    </OverlaySection>
                  </>
                )}
                {page === 'usePassword' && (
                  <>
                    <OverlaySection type="info">
                      <OverlayTitle goBack={goBack}>Sign in With Password</OverlayTitle>
                    </OverlaySection>
                    <OverlaySection type="actions">
                      <SignInWithPassword showForgotPasswordPage={() => setPage('forgotPassword')} />
                      <div className={styles.footer}>
                        <TermsAndConditions />
                      </div>
                    </OverlaySection>
                  </>
                )}
                {page === 'forgotPassword' && (
                  <>
                    <OverlaySection type="info">
                      <OverlayTitle goBack={goBack}>Forgot Password</OverlayTitle>
                    </OverlaySection>
                    <OverlaySection type="actions">
                      <ForgotPassword showMainPage={() => setPage('signIn')} />
                    </OverlaySection>
                  </>
                )}
              </Overlay>
              {(page === 'signIn' || page === 'createAccount') && (
                <div className={styles.extra}>
                  {page === 'signIn' && (
                    <>
                      <Text className={styles.helpText}>Don't have an account?</Text>
                      <Button onClick={() => setPage('createAccount')}>Create an account</Button>
                    </>
                  )}
                  {page === 'createAccount' && (
                    <>
                      <Text className={styles.helpText}>Already have an account?</Text>
                      <Button onClick={() => setPage('signIn')}>Sign In</Button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </MultiPage>
      </AuthLayout>
    </div>
  );
};

export default SignInLayout;
