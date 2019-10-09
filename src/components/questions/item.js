import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@fogcreek/shared-components';

import { CDN_URL } from 'Utils/constants';
import Image from 'Components/images/image';
import { getEditorUrl } from 'Models/project';
import Link from 'Components/link';
import { isDarkColor } from 'Utils/color';
import styles from './questions.styl';

const iconHelp = `${CDN_URL}/63d5c8f3-30cf-451e-953c-b133e7ec9007%2Fask-for-help.svg?v=1569605866088`;

function truncateQuestion(question) {
  const max = 140;
  if (question.length > max) {
    return `${question.substring(0, max - 1)}…`;
  }
  return question;
}

function truncateTag(tag) {
  const max = 15;
  return tag.substring(0, max);
}

const QuestionItem = ({ colorOuter, colorInner, domain, question, tags, userAvatar, userColor, userLogin, path, line, character }) => (
  <>
    <Image className={styles.helpIcon} src={iconHelp} alt="Help icon" />
    <Link
      to={getEditorUrl(domain, path, line, character)}
      data-track="question"
      data-track-label={domain}
      className={styles.question}
      style={{ backgroundColor: colorOuter }}
    >
      <div className={styles.questionInner} style={{ backgroundColor: colorInner }}>
        <div className={styles.questionAsker}>
          <Image className={styles.avatar} src={userAvatar} style={{ backgroundColor: userColor }} alt="" />
          <Button as="span">Help {userLogin}</Button>
        </div>

        <div className={classNames(styles.questionText, { [styles.dark]: isDarkColor(colorInner) })} title={question}>
          {truncateQuestion(question)}
        </div>
        <div className={styles.questionTags}>
          {tags.map((tag) => (
            <div key={tag} className={styles.tag} title={tag}>
              {truncateTag(tag)}
            </div>
          ))}
        </div>
      </div>
    </Link>
  </>
);
QuestionItem.propTypes = {
  colorOuter: PropTypes.string.isRequired,
  colorInner: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  userAvatar: PropTypes.string.isRequired,
  userColor: PropTypes.string.isRequired,
  userLogin: PropTypes.string.isRequired,
  path: PropTypes.string,
  line: PropTypes.number,
  character: PropTypes.number,
};

QuestionItem.defaultProps = {
  path: '',
  line: 0,
  character: 0,
};

export default QuestionItem;
