import React from 'react';
import { Mark } from '@fogcreek/shared-components';
import Link from 'Components/link';
import Heading from 'Components/text/heading';
import classnames from 'classnames';
import styles from './about.styl';
import pageStyles from '../../presenters/pages/about/about.styl';

export const BlockSection = ({ children, className }) => <section className={classnames(styles.blockSection, className)}>{children}</section>;

export const BoardSection = ({ markColor, useDefaultHeadingSize }) => (
  <section>
    <Heading tagName="h2" className={classnames({ [pageStyles.h2]: !useDefaultHeadingSize }, styles.boardHeading)}>
      <Mark color={`var(--mark-${markColor})`}>Join our board</Mark>
    </Heading>
    <p className={classnames(styles.boardSection, pageStyles.backgroundSection)}>
      We're making an open call for a board member for Glitch.{' '}
      <Link to="https://glitch.com/culture/an-open-board/">Learn more about the process.</Link>
    </p>
  </section>
);

export const Bio = ({ name, imageUrl, isBoardMember, children }) => (
  <article className={styles.leaderContainer}>
    <img className={styles.avatar} src={imageUrl} alt="" />
    <h3 className={styles.leaderName}>{name}</h3>
    <span className={styles.boardMember}>{isBoardMember && <Mark color="var(--mark-purple)">Board Member</Mark>}</span>
    {children}
  </article>
);
