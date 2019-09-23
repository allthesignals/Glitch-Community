import React from 'react';
import { Mark } from '@fogcreek/shared-components';
import styles from './about.styl';

export const BlockSection = ({ children }) => <section className={styles.blockSection}>{children}</section>;

export const Bio = ({ name, imageUrl, isBoardMember, children }) => (
  <article className={styles.leaderContainer}>
    <img className={styles.avatar} src={imageUrl} alt="" />
    <h3 className={styles.leaderName}>{name}</h3>
    <span className={styles.boardMember}>{isBoardMember && <Mark color="var(--mark-purple)">Board Member</Mark>}</span>
    {children}
  </article>
);