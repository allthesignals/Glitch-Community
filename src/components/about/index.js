import React from 'react';
import { Mark } from '@fogcreek/shared-components';
import classNames from 'classnames';
import styles from './about.styl';

export const BlockSection = ({ children, className }) => <section className={classNames(styles.blockSection, className)}>{children}</section>;

export const Bio = ({ name, imageUrl, isBoardMember, children }) => (
  <article className={styles.leaderContainer}>
    <img className={styles.avatar} src={imageUrl} alt="" />
    <h3 className={styles.leaderName}>{name}</h3>
    <span className={styles.boardMember}>{isBoardMember && <Mark color="var(--mark-purple)">Board Member</Mark>}</span>
    {children}
  </article>
);
