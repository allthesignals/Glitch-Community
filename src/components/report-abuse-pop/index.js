import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { parseOneAddress } from 'email-addresses';
import { debounce, trimStart } from 'lodash';
import axios from 'axios';
<<<<<<< HEAD
import { Actions, Button, Icon, Info, Loader, Popover, Title } from '@fogcreek/shared-components';
=======
import { Button, Icon, Loader, TextArea, TextInput } from '@fogcreek/shared-components';
>>>>>>> 930063bc93006fdc321e494727128a9aaa3d991f

import Notification from 'Components/notification';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { getAbuseReportTitle, getAbuseReportBody } from 'Utils/abuse-reporting';

import styles from './styles.styl';
import { emoji, widePopover } from '../global.styl';

function getDefaultReason(reportedType) {
  if (reportedType === 'user') {
    return "This user profile doesn't seem appropriate for Glitch because...";
  }
  if (reportedType === 'home') {
    return "[Something here] doesn't seem appropriate for Glitch because...";
  }
  return `This ${reportedType} doesn't seem appropriate for Glitch because...`;
}

function validateReason(reason, reportedType) {
  if (!reason) return 'A description of the issue is required';
  if (reason === getDefaultReason(reportedType)) return 'Reason is required';
  return '';
}

function validateEmail(email, currentUser) {
  if (currentUser.login) return '';
  if (!email) return 'Email is required';
  if (!parseOneAddress(email)) return 'Please enter a valid email';
  return '';
}

function useDebouncedState(initialState, timeout) {
  const [state, setState] = useState(initialState);
  const setDebounced = useMemo(() => debounce(setState, timeout));
  return [state, setDebounced];
}

const Success = () => (
  <>
    <Title>Report Abuse</Title>
    <Actions>
      <Notification persistent type="success">Report Sent</Notification>
      Thanks for helping to keep Glitch a safe, friendly community <Icon className={emoji} icon="park" />
    </Actions>
  </>
);

const Failure = ({ value }) => (
  <>
    <Title>
      Failed to Send <Icon className={emoji} icon="sick" />
    </Title>
    <Info>
      But you can still send us your message by emailing the details below to <strong>support@glitch.com</strong>
    </Info>
    <Actions>
      <textarea className={styles.manualReport} value={value} readOnly />
    </Actions>
  </>
);

function ReportAbusePop({ reportedType, reportedModel }) {
  const { currentUser } = useCurrentUser();
  const [status, setStatus] = useState('ready'); // ready -> loading -> success | error

  const [reason, setReason] = useState(getDefaultReason(reportedType));
  const [reasonError, setReasonError] = useDebouncedState('', 200);
  const reasonOnChange = (value) => {
    setReason(value);
    setReasonError(validateReason(value, reportedType));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useDebouncedState('', 200);
  const emailOnChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value, currentUser));
  };

  const formatRaw = () => getAbuseReportBody(currentUser, email, reportedType, reportedModel, reason);

  const submitReport = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email, currentUser);
    const reasonErr = validateReason(reason, reportedType);
    if (emailErr || reasonErr) {
      setEmailError(emailErr);
      setReasonError(reasonErr);
      return;
    }

    setStatus('loading');
    try {
      await axios.post('https://support-poster.glitch.me/post', {
        raw: formatRaw(),
        title: getAbuseReportTitle(reportedModel, reportedType),
      });

      setStatus('success');
    } catch (error) {
      captureException(error);
      setStatus('error');
    }
  };

  if (status === 'success') return <Success />;
  if (status === 'error') return <Failure value={trimStart(formatRaw())} />;

  return (
    <form onSubmit={submitReport}>
      <Title>Report Abuse</Title>
      <Actions>
        <TextArea
          label="Report Abuse"
          className={styles.textArea}
          value={reason}
          onChange={reasonOnChange}
          onBlur={() => reasonOnChange(reason)}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          error={reasonError}
        />
      </Actions>
      {currentUser.login ? (
        <Info>
          <div className={styles.right}>
            from <strong>{currentUser.login}</strong>
          </div>
        </Info>
      ) : (
        <Info>
          <TextInput
            value={email}
            onChange={emailOnChange}
            onBlur={() => emailOnChange(email)}
            placeholder="your@email.com"
            error={emailError}
            type="email"
            label="email address"
          />
        </Info>
      )}
      <Actions>
        {status === 'loading' ? (
          <Loader style={{ width: '25px' }} />
        ) : (
          <Button size="small" onClick={submitReport}>
            Submit Report
          </Button>
        )}
      </Actions>
    </form>
  );
}

const ReportAbusePopButton = ({ reportedType, reportedModel }) => (
  <Popover align="topLeft" className={widePopover} renderLabel={({ onClick, ref }) => <Button variant="secondary" size="small" onClick={onClick} ref={ref}>Report Abuse</Button>}>
    {() => (
      <ReportAbusePop reportedType={reportedType} reportedModel={reportedModel} />
    )}
  </Popover>
);

ReportAbusePopButton.propTypes = {
  reportedType: PropTypes.oneOf(['project', 'collection', 'user', 'team', 'home']).isRequired,
  reportedModel: PropTypes.object, // the actual model, or null if no model (like for the home page)
};

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
