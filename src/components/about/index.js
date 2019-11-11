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
    <div className={classnames(styles.boardSection, pageStyles.backgroundSection)}>
      <p>
        We're making an open call for a board member for Glitch.{' '}
        <Link to="https://glitch.com/culture/an-open-board/">Learn more about the process.</Link>
      </p>
      <Heading tagName="h3" className={pageStyles.h3}>
        What’s expected of a board member at Glitch?
      </Heading>
      <p>
        In addition to the expectations and duties of any board member at a private company, Glitch has quarterly board meetings we’d expect you to
        attend at HQ in NYC. Don’t worry, these are scheduled far in advance and we’ll help you with any travel arrangements you need. If you’re
        looking for a primer on board duties, we think the <Link to="https://www.gsb.stanford.edu/sites/gsb/files/publication-pdf/cgri-quick-guide-03-board-directors-duties-liabilities.pdf">first five pages here</Link> are helpful and succinct.
      </p>
      <Heading tagName="h3" className={pageStyles.h3}>
        How will this person be compensated?
      </Heading>
      <p>
        Glitch began publishing salary ranges with every job listing over a year ago because we feel it’s important for folks to know up front and
        take away arguably the most stressful part of a job search. Though the open board seat is certainly not a full time gig (we would anticipate a
        couple of hours a month), the same intent applies.
      </p>
      <p>
        As a member of our board you’ll be compensated with substantial equity in Glitch, Inc. on a generous vesting schedule. We’ll also ask that you
        attend quarterly meetings in NYC, and if you’re not based in NYC we’ll pay for all travel expenses and lodging so that you can attend in
        person.
      </p>
    </div>
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
