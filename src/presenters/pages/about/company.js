import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Mark, Icon } from '@fogcreek/shared-components';
import { BlockSection, Bio } from 'Components/about';
import Heading from 'Components/text/heading';
import AboutLayout from './about-layout';
import styles from './company.styl';
import aboutStyles from './about.styl';

const AboutCompanyPage = withRouter(() => (
  <AboutLayout mainClassName={aboutStyles.main}>
    <BlockSection>
      <Heading tagName="h1">
        A <Mark color="var(--mark-pink)">different</Mark> kind of company
      </Heading>
      <article>
        <Heading tagName="h3">One of the most influential small tech companies ever</Heading>
        <p>We started out as Fog Creek Software, a pioneering independent tech company that has always put people first.</p>
        <p>
          Our team invented Trello, co-created Stack Overflow, and launched many other groundbreaking apps that collectively have made us one of the
          most influential small tech companies ever.
        </p>
      </article>
      <article>
        <Heading tagName="h3">Built for sustainability</Heading>
        <p>
          We care about making Glitch a meaningful platform for the long term. Our company is 20 years old—that’s ancient in internet terms. We’re
          independent, privately held, and transparent and open in our business model and processes.
        </p>
        <p>This matters because we want you to be as invested in our long-term, sustainable success as we are.</p>
      </article>
      <article>
        <Heading tagName="h3">Made in NYC, and around the world</Heading>
        <p>We’re proud to be headquartered in New York City, but about half of our employees are remote.</p>
        <p>
          We have a strong remote work culture where all of our meetings are online and apps and tools like Slack and Google Hangouts are the normal
          way we communicate.
        </p>
      </article>
      <article>
        <Heading tagName="h3">A considered work environment</Heading>
        <p>We pioneered remote-working and private offices for creative workers over a decade ago.</p>
        <p>Our work environment has been carefully and thoughtfully designed to give each person both private and collaborative workspaces. </p>
      </article>
      <article>
        <Heading tagName="h3">Our inclusion efforts aren’t just platitudes</Heading>
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
        <Heading tagName="h3">We are on the inside what we hope to inspire on the outside</Heading>
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
        <Heading tagName="h3">We’ve built a social platform on the internet that will never tolerate hate speech</Heading>
        <p>This isn’t actually complicated.</p>
      </article>
    </BlockSection>

    <BlockSection>
      <Heading tagName="h2">
        <Mark color="var(--mark-blue)">Leadership</Mark>
      </Heading>
      <Bio
        imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FanilDashWhiteBG.png?1537834047329"
        name="Anil Dash, CEO"
        isBoardMember
      >
        <p>Anil Dash is recognized as one of the most prominent voices advocating for a more humane, inclusive and ethical tech industry.</p>
        <p>
          A former advisor to the Obama White House’s Office of Digital Strategy, he advises major startups and non-profits including Medium,
          DonorsChoose and Project Include.
        </p>
      </Bio>
      <Bio
        imageUrl="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FJordanBioPhoto__1_-removebg-preview.png?v=1561974441318"
        name="Jordan Harris, COO"
      >
        <p>
          An experienced operating executive and entrepreneur, Jordan Harris formed the New Media Group at Reed Elsevier. He went on to found
          Hurricane Interactive and Notara Inc., which pioneered Brand Marketing Automation.
        </p>
        <p>He advises non-profits including Eyebeam, a platform for artists to engage society's relationship with technology.</p>
      </Bio>
    </BlockSection>
    <section className={aboutStyles.backgroundSection}>
      <Heading tagName="h4" className={styles.leaderHeader}>Team leads</Heading>
      <div className={styles.leads}>
        <span>
          <img
            className={styles.avatar}
            src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FMegBioPhoto-removebg-preview.png?v=1561974441838"
            alt=""
          />
          <p>Meg Tobin</p>
        </span>
        <span>
          <img
            className={styles.avatar}
            src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FJennBio-removebg.png?v=1561974442460"
            alt=""
          />
          <p>Jenn Schiffer</p>
        </span>
        <span>
          <img className={styles.avatar} src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Ftim-nobg.png?v=1561974908737" alt="" />
          <p>Tim Kington</p>
        </span>
        <span>
          <img
            className={styles.avatar}
            src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fmaurice-cherry-removebg-preview%20(1).png?v=1561988404303"
            alt=""
          />
          <p>Maurice Cherry</p>
        </span>
        <span>
          <img
            className={styles.avatar}
            src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FVicBioPhoto-removebg-preview.png?v=1561974442420"
            alt=""
          />
          <p>Victoria Kirst</p>
        </span>
      </div>
    </section>
    <BlockSection>
      <Heading tagName="h2">
        <Mark color="var(--mark-orange)">Founders</Mark>
      </Heading>
      <Bio
        imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FjoelSpolsky.png?1537833029020"
        name="Joel Spolsky, Co-Founder"
        isBoardMember
      >
        <p>Joel Spolsky is Co-Founder of Glitch (formerly Fog Creek Software) and created FogBugz and Trello (now part of Atlassian).</p>
        <p>Most recently, he was CEO and Co-Founder of Stack Overflow.</p>
      </Bio>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FmichaelPryor.png?1537834853615" name="Michael Pryor, Co-Founder">
        <p>Michael Pryor is Head of Product, Trello at Atlassian.</p>
        <p>
          As Co-Founder and President of Fog Creek Software, he was CEO of Trello until its acquisition and also serves on the board of Stack
          Overflow.
        </p>
      </Bio>
    </BlockSection>
    <BlockSection>
      <Heading tagName="h2">
        <Mark color="var(--mark-green)">Advisors</Mark>
      </Heading>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FkimberlyBryant.png?1534858064619" name="Kimberly Bryant">
        <p>Kimberly Bryant is an entrepreneur and innovator who is founder and CEO of Black Girls Code.</p>
        <p>
          By leading the non-profit dedicated to increasing the number of women of color in the digital space, Bryant has introduced computer
          programming to young girls from underrepresented communities around the world.
        </p>
      </Bio>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FfranklinLeonard.png?1534858064426" name="Franklin Leonard">
        <p>
          Franklin Leonard is a film executive and founder of The Black List, a yearly publication of Hollywood’s most popular unproduced screenplays.
        </p>
        <p>
          Leonard helped diversify the Box Office by facilitating creative opportunities and partnerships that have identified writers from
          underrepresented groups.
        </p>
      </Bio>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FjasonGoldman.png?1534858063148" name="Jason Goldman">
        <p>Jason Goldman was the first-ever Chief Digital Officer of the White House.</p>
        <p>
          An experienced tech industry executive, Goldman has helped shape the digital age through pivotal roles at Blogger, Google, Twitter, Obvious,
          Branch, and Medium.
        </p>
      </Bio>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FcamilleFournierNoBG.png?v=1562601144932" name="Camille Fournier">
        <p>
          Camille Fournier is Head of Platform Engineering at Two Sigma, with prior roles including CTO of Rent the Runway, Software Engineer at
          Microsoft, and Technical Specialist at Goldman Sachs. An open source contributor and project committee member, Fournier is a well-respected
          voice within the tech community and author of The Manager’s Path.
        </p>
      </Bio>
      <Bio imageUrl="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2FalanCooper.png?1534858064575" name="Alan Cooper">
        <p>Alan Cooper is a software design leader and author, who is widely known as the &quot;Father of Visual Basic.&quot;</p>
        <p>Cooper has helped humanize technology through his groundbreaking work in the field of user experience (UX) and interaction design.</p>
      </Bio>
    </BlockSection>
    <section>
      <Heading tagName="h2">
        <Mark color="var(--mark-purple)">Staff diversity report</Mark>
      </Heading>
      <div style={{ height: '600px', width: '100%' }}>
        <iframe
          src="https://glitch.com/embed/#!/embed/diversity-report-spring-2019?path=README.md&previewSize=100&attributionHidden=true"
          title="diversity-report-spring-2019 on Glitch"
          allow="geolocation; microphone; camera; midi; vr; encrypted-media"
          style={{ height: '100%', width: '100%', border: 0 }}
        />
      </div>
    </section>
    <section>
      <Heading tagName="h2">
        <Mark color="var(--mark-pink)">Contact info</Mark>
      </Heading>
      <p className={styles.address}>
        Glitch Inc.
        <br />
        75 Broad Street
        <br />
        Suite 1904
        <br />
        New York City
        <br />
        NY 10004
        <br />
        USA
      </p>
      <Button className={styles.emailButton} as="a" href="mailto:support@glitch.com">
        <Icon icon="email" /> support@glitch.com
      </Button>
    </section>
  </AboutLayout>
));

export default AboutCompanyPage;
