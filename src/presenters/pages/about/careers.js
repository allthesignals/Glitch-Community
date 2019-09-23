import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Mark, Icon } from '@fogcreek/shared-components';
import { Helmet } from 'react-helmet-async';
import { BlockSection } from 'Components/about';
import AboutLayout from './about-layout';
import styles from './careers.styl';
import aboutStyles from './about.styl';
import '../../../utils/lever/lever.styl';

const pageDescription = 'Glitch is where you’ll do your best work. Here’s why.';
const pageTitle = 'About Glitch - Careers';

const LeverSection = () => {
  import('../../../utils/lever/lever.js');
  window.leverJobsOptions = { accountName: 'glitch', includeCss: true };
  return <section id="lever-jobs-container" className={aboutStyles.backgroundSection} />;
};

const AboutCareersPage = withRouter(() => (
  <AboutLayout mainClassName={styles.main}>
    <Helmet>
      <meta name="description" content={pageDescription} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content="glitch, career, careers, job, jobs, hire, hiring, work, new york, nyc, remote, us, role, position, listing" />
      <meta property="og:title" content={pageTitle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta property="og:description" content={pageDescription} />
    </Helmet>
    <h1 className={aboutStyles.h1}>Careers</h1>
    <h2 className={aboutStyles.h2}>
      <Mark color="var(--mark-pink)">Open positions</Mark>
    </h2>
    <LeverSection />
    <BlockSection>
      <h2 className={aboutStyles.h2}>
        <Mark color="var(--mark-blue)">Things you won’t find at most other companies</Mark>
      </h2>
      <p>Glitch is where you’ll do your best work. Here are just a few examples of why working at Glitch is different.</p>
      <article>
        <h3>No endless meetings</h3>
        <p>
          We don’t have very many meetings, but when we do, they’re well-organized with a specific agenda. Every meeting is remote-first, with each
          person in the meeting joining on video chat—even if they’re based in our NYC HQ. That way, nobody is stuck feeling disconnected or
          forgotten.
        </p>
        <p>
          Each person takes turns keeping notes because we don’t want women or other underrepresented team members to feel unduly obligated to handle
          such tasks, and every meeting with more than 2 people has notes shared to the entire company so that everyone knows what’s going on.
        </p>
      </article>
      <article>
        <h3>We respect working hours</h3>
        <p>
          Our office is usually empty by 6pm or earlier each day, and remote workers leave their home offices on the same schedule, too. At Glitch,
          your coworkers won’t even @mention you in Slack when it’s outside of working hours, and if something is shared during non-work times,
          there’s no expectation that you’ll respond until you’re back at work.
        </p>
        <p>
          There are exceptions for roles where people are on-call or special cases like events or unusual circumstances, but on a day-to-day basis, we
          are enormously productive by letting people live their lives and have their downtime.
        </p>
      </article>
      <article>
        <h3>Almost no email</h3>
        <p>
          Most people at Glitch get fewer than a dozen email messages in a week from their coworkers. We use email for especially urgent company-wide
          alerts, and to work with people at other companies.
        </p>
        <p>
          For ordinary chat, we prefer to use Slack, and for lengthier conversations, we write out our ideas in full and share them for feedback and
          comment.
        </p>
      </article>
      <article>
        <h3>Internal salary transparency</h3>
        <p>
          We want you to <i>know </i>you’re being paid fairly. We share salary ranges by role internally so that you never have to worry about other
          folks being paid differently for doing the same work as you.
        </p>
        <p>We respect everyone’s contributions toward our goals regardless of their role. So executive pay is capped at 5X the lowest salary.</p>
      </article>
      <article>
        <h3>Comprehensive healthcare</h3>
        <p>
          From day one, we’ve offered complete health insurance for every employee. We set you up with great health insurance with a really high
          deductible—and then we pay the entire deductible for you.
        </p>
        <p>And of course, we offer unlimited sick days and have generous policies if you need to take care of a sick family member, too.</p>
      </article>
      <article>
        <h3>Gratitude is a company value</h3>
        <p>
          A favorite part of the week is when the whole company takes time out to listen as team members publicly thank each other. Whether it’s a
          brief nod to someone who helped answer a befuddling technical challenge or a broad acknowledgment of a team that worked tirelessly on a
          lengthy project.
        </p>
        <p>This should be corny, but it isn't. The habit of recognizing each other’s efforts leads to a culture of gratitude.</p>
      </article>
      <article>
        <h3>We put the important stuff in writing</h3>
        <p>
          When new issues impacting employees emerge, we don’t just say “trust me, it’ll be okay.” Taking care of employees and protecting workers
          means putting down our commitments to them and their families in writing.
        </p>
        <p>
          Like our{' '}
          <a href="https://medium.com/make-better-software/climate-leave-paid-time-off-for-extreme-weather-disruptions-c5691fd346c3">
            Climate Leave policy
          </a>
          , for example.
        </p>
      </article>
      <article>
        <h3>Our hiring process isn’t a hazing ritual</h3>
        <p>
          People are regularly asked to jump through bizarre hoops in job interviews, like undertaking whiteboard coding challenges. We think they’re
          exclusionary and pointless.
        </p>
        <p>Instead, we focus on how real people think, in realistic scenarios they might actually encounter during work.</p>
      </article>
    </BlockSection>
    <section className={aboutStyles.backgroundSection}>
      <article className={styles.photoSection}>
        <img
          src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F993109ed1c7580173f8e602f3d6e881d-xlarge.jpg?1559307581786"
          alt="Glitch staff working"
        />
        <img
          src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fbaf5e6e3eb8c3c9274bb56e3105ed452-large.jpg"
          alt="Glitch staff walking"
        />
        <img
          src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F0b1613403bacaeaf9e4f28db84bc5e75-xlarge.jpg?1559307583178"
          alt="Glitch staff playing video games"
        />
      </article>
    </section>
    <BlockSection>
      <h2 className={aboutStyles.h2}>
        <Mark color="var(--mark-green)">Meaningful benefits. Healthy culture.</Mark>
      </h2>
      <p>We’re doubling-down on providing the best place to work in the entire tech industry with benefits that promote work-life balance.</p>
      <article>
        <p>Comprehensive health care for you and your family with 100% of premiums paid for by Glitch.</p>
      </article>
      <article>
        <p>20 vacation days each year—and encouragement from your coworkers to use them!</p>
      </article>
      <article>
        <p>All NYC employees receive a free unlimited monthly MetroCard and lunch every day. </p>
      </article>
      <article>
        <p>Fully paid parental leave of up to 16 weeks, with the option to work part-time or with more flex-time upon returning to work.</p>
      </article>
      <article>
        <p>
          401(k) retirement plan with a matching plan (Glitch will match the first 3% of contributions at 100% and the next 2% of contributions at
          50%).
        </p>
      </article>
      <article>
        <p>
          Monthly wellness stipend of $150 that can be used for a gym membership, nutrition counseling, yoga or meditation classes, or any other
          wellness activity of your choice.
        </p>
      </article>
      <article>
        <p>A learning and development budget of $3,500 along with 3 conference days annually. We also offer tuition reimbursement. </p>
      </article>
      <article>
        <p>Your choice of technical set up and equipment. Remote workers receive a $100 monthly stipend toward home office expenses.</p>
      </article>
      <article>
        <p>
          Unlimited sick days, plus additional caretaker days for when a family member is sick. We don’t think you should have to use vacation time
          for these unexpected circumstances.
        </p>
      </article>
    </BlockSection>
    <section className={aboutStyles.backgroundSection}>
      <article className={styles.photoSection}>
        <img
          src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2Fd92f352ab54cfd9be0457776317e0ec6-xlarge.jpg?1559307599792"
          alt="Glitch staff talking"
        />
        <img
          src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F7f2b4dd2435996315bb77787f0c38d0b-xlarge.jpg?1559307600387"
          alt="Looky What We Made zine"
        />
        <img
          src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F1e196309fd17fa4af027de3c345fc12f-xlarge.jpg?1559307839260"
          alt="Glitch staff talking"
        />
      </article>
    </section>
    <BlockSection>
      <h2 className={aboutStyles.h2}>Glitch handbook</h2>
      <p>
        If you want a more in-depth look at how our company runs day-to-day, we encourage to take a look at our{' '}
        <a href="https://handbook.glitch.me/">employee handbook</a>.
      </p>
      <p>
        This is the <i> actual </i>handbook we use to help new employees get up to speed and what our employees refer to every day when they want to
        know about company policies. We place a very high value on honesty and transparency and want every candidate to be confident that Glitch is
        the right place to be!
      </p>
      <div style={{ height: '700px', width: '100%' }}>
        <iframe
          src="https://glitch.com/embed/#!/embed/handbook?path=md/welcome.md&previewSize=100&attributionHidden=true"
          title="handbook on Glitch"
          allow="geolocation; microphone; camera; midi; vr; encrypted-media"
          style={{ height: '100%', width: '100%', border: 0 }}
        />
      </div>
    </BlockSection>
  </AboutLayout>
));

export default AboutCareersPage;
