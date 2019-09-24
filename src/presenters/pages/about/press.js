import React, { useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Button, Mark, ButtonGroup, ButtonSegment, SegmentedButton } from '@fogcreek/shared-components';
import { BlockSection } from 'Components/about';

import AboutLayout from './about-layout';
import aboutStyles from './about.styl';
import styles from './press.styl';

const AboutPressPage = withRouter(() => {
  const iconInput = useRef();
  const [embedToDisplay, setEmbedToDisplay] = useState('logos');

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      // swallow errors
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text);
  }

  return (
    <AboutLayout>
      <h1 className={aboutStyles.h1}>Press</h1>
      <BlockSection className={styles.section}>
        <article>
          <h3> Writing about glitch? </h3>
          <p>Below are resources that might come in handy. If you have any questions or need any other materials, let us know! </p>
          <center>
            <Button as="a" href="mailto:press@glitch.com" className={styles.pressButton}>
              <img src="https://cdn.glitch.com/99defeae-ef08-4bb7-ba01-385a81949100%2FemailBlack.svg?1537835934697" alt="" width="18" />{' '}
              press@glitch.com
            </Button>
          </center>
          <br />
          <h3>Social media</h3>
          <p>You can follow us on social media to see the latest cool apps created by the Glitch community:</p>
          <center>
            <Button as="a" href="https://twitter.com/glitch" target="_blank" className={styles.pressButton}>
              <img src="https://cdn.glitch.com/99defeae-ef08-4bb7-ba01-385a81949100%2FtwitterBlack.svg?1537835525669" width="16" alt="" /> Twitter
            </Button>
            &nbsp;{' '}
            <Button as="a" href="https://instagram.com/glitchdotcom" target="_blank">
              <img src="https://cdn.glitch.com/99defeae-ef08-4bb7-ba01-385a81949100%2Finstagram_black.svg?1537835525892" width="14" alt="" />{' '}
              Instagram
            </Button>
          </center>
          <br />
          <p>
            Or check out the latest{' '}
            <a href="http://latest-gtw.glitch.me/now" target="_new">
              <i>Glitch This Week</i>
            </a>{' '}
            collection.
          </p>
        </article>
        <article>
          <h3>Embed an app in your article</h3>
          <p>
            Here's <a href="https://glitch.com/help/embed/">how to embed a Glitch app </a>in your own blog post or website.
          </p>
          <div className={styles.centerImageWrapper}>
            <img
              src="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2FembedAProject.png?v=1560251131924"
              alt="Click the Share button in the editor for a project, then in the menu that opens, click 'Share embed'"
            />
          </div>
        </article>
      </BlockSection>
      <section className={aboutStyles.section}>
        <h2 className={aboutStyles.h2}>
          <Mark color="var(--mark-orange)">Logos and screenshots</Mark>
        </h2>
        <p className={aboutStyles.descriptionText}>
          <a href="https://en.wikipedia.org/wiki/Koinobori" target="_new">
            Koinobori <Icon alt="" icon="carpStreamer" />
          </a>
          inspired our logo and has become the way our community references Glitch on social media.
        </p>
        <div className={aboutStyles.descriptionText}>
          <ButtonGroup size="normal">
            <ButtonSegment onClick={() => {}} ref={iconInput}>
              <Icon alt="koinobori" icon="carpStreamer" />
            </ButtonSegment>
            <ButtonSegment onClick={() => copyTextToClipboard('🎏')}>
              <img src="https://cdn.glitch.com/us-east-1%3A146a1e92-1a4b-4cc0-b380-6a759316dc9d%2Fclippy.svg" width="13" alt="Copy to clipboard" />
            </ButtonSegment>
          </ButtonGroup>
        </div>
        <div className={styles.assetButtons}>
          <p>Grap all image assets:</p>
          <Button
            variant="cta"
            as="a"
            href="https://cdn.glitch.com/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fglitch-media-assets-all.zip?v=1562144709175"
          >
            Download Brand Assets (ZIP)
          </Button>
          <p>Or select those you want:</p>
          <SegmentedButton
            value={embedToDisplay}
            onChange={setEmbedToDisplay}
            options={[{ id: 'logos', label: 'Logos' }, { id: 'screenshots', label: 'Screenshots' }]}
          />
        </div>
        {embedToDisplay === 'logos' && (
          <div className={aboutStyles.bioEmbed}>
            <iframe
              src="https://glitch.com/embed/#!/embed/press-glitch-logos?path=watch.json&previewSize=100&attributionHidden=true"
              title="press-glitch-logos on Glitch"
              allow="geolocation; microphone; camera; midi; vr; encrypted-media"
            />
          </div>
        )}
        {embedToDisplay === 'screenshots' && (
          <div className={aboutStyles.bioEmbed}>
            <iframe
              src="https://glitch.com/embed/#!/embed/press-glitch-screenshots?path=watch.json&previewSize=100&attributionHidden=true"
              title="press-glitch-screenshots on Glitch"
              allow="geolocation; microphone; camera; midi; vr; encrypted-media"
            />
          </div>
        )}
        <p className={styles.embedAttribution}>
          <small>
            Remixed from <a href="https://glitch.com/edit/#!/image-gallery/">image-gallery</a>, created by Glitch community member{' '}
            <a href="https://glitch.com/@stefan">@stefan</a>.
          </small>
        </p>
      </section>
      <BlockSection className={styles.pressSection}>
        <h2 className={aboutStyles.h2}>
          <Mark color="var(--mark-green)">Glitch in the press</Mark>
        </h2>
        <article>
          <h3>
            <a
              href="https://www.fastcompany.com/90135655/glitch-the-sleeper-coding-platform-used-by-facebook-and-slack"
              target="_blank"
              rel="noopener noreferrer"
            >
              Glitch: The Sleeper Coding Community Used By Facebook And Slack
            </a>
          </h3>
          <p>
            <a
              href="https://www.fastcompany.com/90135655/glitch-the-sleeper-coding-platform-used-by-facebook-and-slack"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2F2000px-Fast_Company_logo.svg.png?1539170983971"
                alt="Fast Company"
              />
            </a>
          </p>
        </article>
        <article>
          <h3>
            <a
              href="https://thenextweb.com/dd/2018/03/30/glitch-rewind-wants-make-version-control-easy-everyone/"
              target="_blank"
              rel="noopener noreferrer"
            >
              “A platform where users can experiment without dealing with the other headaches of coding”
            </a>
          </h3>
          <p>
            <a
              href="https://thenextweb.com/dd/2018/03/30/glitch-rewind-wants-make-version-control-easy-everyone/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F69fa85dc-c1b2-4954-bec7-3df9be36c3db_thenextweb.png?1559311478565"
                alt="The Next Web"
              />
            </a>
          </p>
        </article>
        <article>
          <h3>
            <a href="https://www.wired.com/story/clive-thompson-tinker-with-code/" target="_blank" rel="noopener noreferrer">
              It’s Time to Make Code More Tinker-friendly
            </a>
          </h3>
          <p>
            <a href="https://www.wired.com/story/clive-thompson-tinker-with-code/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2F2000px-Wired_logo.svg.png?1539170984249" alt="Wired" />
            </a>
          </p>
        </article>
        <article>
          <h3>
            <a href="https://www.engadget.com/2018/04/01/glitch-app-creation-community-launch/" target="_blank" rel="noopener noreferrer">
              Glitch launches its ‘YouTube for app creators’
            </a>
          </h3>
          <p>
            <a href="https://www.engadget.com/2018/04/01/glitch-app-creation-community-launch/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2Feng-logo-928x201.png?1539170983711" alt="Engadget" />
            </a>
          </p>
        </article>
        <article>
          <h3>
            <a
              href="https://www.theverge.com/2017/3/14/14921528/glitch-new-coding-site-anil-dash-collaboration-remix-apps"
              target="_blank"
              rel="noopener noreferrer"
            >
              “A collaborative community of coders, who can help each other out with projects and build off each other’s work.”
            </a>
          </h3>
          <p>
            <a
              href="https://www.theverge.com/2017/3/14/14921528/glitch-new-coding-site-anil-dash-collaboration-remix-apps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://cdn.glitch.com/b205c719-a61d-400a-9e80-8784c201e1d2%2F69fa85dc-c1b2-4954-bec7-3df9be36c3db_the_verge_2016_logo.png?1559311478887"
                alt="The Verge"
              />
            </a>
          </p>
        </article>
        <article>
          <h3>
            <a href="https://boingboing.net/2018/04/17/glitch-makes-programming-on-th.html" target="_blank" rel="noopener noreferrer">
              “I tinkered with it... and within minutes had overcome hurdles that I thought I’d never have the time or energy to figure out.”
            </a>
          </h3>
          <p>
            <a href="https://boingboing.net/2018/04/17/glitch-makes-programming-on-th.html" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.glitch.com/69fa85dc-c1b2-4954-bec7-3df9be36c3db%2Fboing-boing-logo.png?1539171048555" alt="BoingBoing" />
            </a>
          </p>
        </article>
      </BlockSection>
    </AboutLayout>
  );
});

export default AboutPressPage;
