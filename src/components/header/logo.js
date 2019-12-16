import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './header.styl';

const LOGO_DAY = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg';
const LOGO_SUNSET = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg';
const LOGO_NIGHT = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg';
const LOGO_HALLOWEEN = 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Ffish-dead.svg?v=1572544267739';

const pickLogo = (date) => {
  if (date.getMonth()+1 === 10 && date.getDate() === )
  const hour = date.getHours();
  if (hour >= 16 && hour < 19) return LOGO_SUNSET;
  if (hour >= 19 || hour < 7) return LOGO_NIGHT;
  return LOGO_DAY;
};

const LogoImage = ({ src }) => <img className={styles.logo} src={src} alt="Glitch" />;

function Logo() {
  const [logo, setLogo] = useState(LOGO_DAY);
  useEffect(() => {
    const handle = window.setInterval(() => {
      setLogo(pickLogo(new Date()));
    }, dayjs.convert(5, 'minutes', 'ms'));

    return () => window.clearInterval(handle);
  }, []);
  return <LogoImage src={logo} />;
}

export default Logo;
