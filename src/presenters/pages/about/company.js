import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { CDN_URL } from 'Utils/constants';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { Button, Mark } from '@fogcreek/shared-components';
import AboutLayout from './about-layout';
import styles from './company.styl';

const blueMark = '#aad6fb';
const pinkMark = '#ffaabf';
const yellowMark = '#fcf3b0';
const purpleMark = '#daa9ff';

const BlockSection = ({ children }) => <section className={styles.blockSection}>{children}</section>;

const AboutCompanyPage = withRouter(() => (
  <AboutLayout mainClassName={styles.main}>
    <h2 className={styles.intro}>
      A <Mark color={pinkMark}>different</Mark> kind of company
    </h2>
    <BlockSection>
      <article>
        <h3>One of the most influential small tech companies ever</h3>
        <p>We started out as Fog Creek Software, a pioneering independent tech company that has always put people first.</p>
        <p>
          Our team invented Trello, co-created Stack Overflow, and launched many other groundbreaking apps that collectively have made us one of the
          most influential small tech companies ever.
        </p>
      </article>
      <article>
        <h3>Built for sustainability</h3>
        <p>
          We care about making Glitch a meaningful platform for the long term. Our company is 20 years old—that’s ancient in internet terms. We’re
          independent, privately held, and transparent and open in our business model and processes.
        </p>
        <p>This matters because we want you to be as invested in our long-term, sustainable success as we are.</p>
      </article>
      <article>
        <h3>Made in NYC, and around the world</h3>
        <p>We’re proud to be headquartered in New York City, but about half of our employees are remote.</p>
        <p>
          We have a strong remote work culture where all of our meetings are online and apps and tools like Slack and Google Hangouts are the normal
          way we communicate.
        </p>
      </article>
      <article>
        <h3>A considered work environment</h3>
        <p>We pioneered remote-working and private offices for creative workers over a decade ago.</p>
        <p>Our work environment has been carefully and thoughtfully designed to give each person both private and collaborative workspaces. </p>
      </article>
      <article>
        <h3>Our inclusion efforts aren’t just platitudes</h3>
        <p>
          Like most tech companies that have been around for two decades, we used to be a really homogenous place. Unlike most tech companies, we
          admit that we screwed up and we’re not making any excuses for it. Instead, we’re making real changes to build a more inclusive culture.
        </p>
        <p>
          It starts from the top—we have a CEO who’s a vocal advocate for underrepresented workers in tech, and we’ve changed everything from our
          recruiting and ally skills training to the way we design our products, all with a goal of ensuring we’re a place that’s welcoming and
          supportive to everyone.
        </p>
      </article>
      <article>
        <h3>We are on the inside what we hope to inspire on the outside</h3>
        <p>It’s impossible to trust a company if you know they don’t practice what they preach.</p>
        <p>
          That’s why we’re committed to zero gaps between our stated and lived values. And that’s also why our values are publicly stated for anyone
          to{' '}
          <a href="https://handbook.glitch.me/" target="_new">
            read and share and remix
          </a>{' '}
          for their own use.
        </p>
      </article>
      <article>
        <h3>We’ve built a social platform on the internet that will never tolerate hate speech</h3>
        <p>This isn’t actually complicated.</p>
      </article>
    </BlockSection>
    <h2 className={styles.intro}>
      <Mark color={blueMark}>Leadership</Mark>
    </h2>
    <BlockSection>
      <article className={styles.leaderContainer}>
        <img className={styles.avatar} src="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FanilDashWhiteBG.png?1537834047329" alt="" />
        <h3 className={styles.leaderName}>Anil Dash, CEO</h3>
        <span className={styles.boardMember}>
          <Mark color={purpleMark}>Board Member</Mark>
        </span>
        <p>Anil Dash is recognized as one of the most prominent voices advocating for a more humane, inclusive and ethical tech industry.</p>
        <p>
          A former advisor to the Obama White House’s Office of Digital Strategy, he advises major startups and non-profits including Medium,
          DonorsChoose and Project Include.
        </p>
      </article>
      <article className={styles.leaderContainer}>
        <img
          className={styles.avatar}
          src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FJordanBioPhoto__1_-removebg-preview.png?v=1561974441318"
          alt=""
        />
        <h3 className={styles.leaderName}>Jordan Harris, COO</h3>
        <p>
          An experienced operating executive and entrepreneur, Jordan Harris formed the New Media Group at Reed Elsevier. He went on to found
          Hurricane Interactive and Notara Inc., which pioneered Brand Marketing Automation.
        </p>
        <p>He advises non-profits including Eyebeam, a platform for artists to engage society's relationship with technology.</p>
      </article>
    </BlockSection>
  </AboutLayout>
));

export default AboutCompanyPage;
