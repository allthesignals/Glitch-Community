import React from 'react';
import { Icon, Button } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import PopoverContainer from 'Components/popover/container';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';

import PasswordSettings from './password-settings';
import TwoFactorSettings from './two-factor-settings';
import styles from './styles.styl';
import { emoji } from '../global.styl';
import MultiPage from '../layout/multi-page';

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();
  const twoFactorEnabled = useDevToggle('Two Factor Auth');

  const primaryEmail = currentUser.emails.find((email) => email.primary);

  return (
    <Overlay className="account-settings-overlay">
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Icon icon="key" className={emoji} />
        </OverlayTitle>
      </OverlaySection>

      <OverlaySection type="actions">
        <MultiPage defaultPage="password">
          {({ page, setPage }) => (
            <div className={styles.accountSettings}>
              {twoFactorEnabled && (
                <div className={styles.accountSettingsActions}>
                  <Button size="small" disabled={page === 'password'} onClick={() => setPage('password')}>
                    Password
                  </Button>
                  <Button size="small" disabled={page === '2fa'} onClick={() => setPage('2fa')}>
                    Two Factor Settings
                  </Button>
                </div>
              )}
              <div className={styles.accountSettingsContent}>
                {page === 'password' ? <PasswordSettings /> : null}
                {page === '2fa' ? <TwoFactorSettings /> : null}
              </div>
            </div>
          )}
        </MultiPage>
      </OverlaySection>
      {!!primaryEmail && (
        <OverlaySection type="info">
          <Text>
            Email notifications are sent to <b>{primaryEmail.email}</b>
          </Text>
        </OverlaySection>
      )}
    </Overlay>
  );
};

const AccountSettingsContainer = ({ children }) => {
  const renderOuter = ({ visible, openPopover }) => (
    <>
      {children(openPopover)}
      {visible && <OverlayBackground />}
    </>
  );
  return <PopoverContainer outer={renderOuter}>{({ visible }) => (visible ? <AccountSettingsOverlay /> : null)}</PopoverContainer>;
};

export default AccountSettingsContainer;
