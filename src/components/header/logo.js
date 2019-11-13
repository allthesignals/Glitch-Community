import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './header.styl';

// const LOGO_HALLOWEEN = 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Ffish-dead.svg?v=1572544267739';
const LOGO_DAY = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg';
const LOGO_SUNSET = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg';
const LOGO_NIGHT = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg';

const LogoImage = ({ src }) => <img className={styles.logo} src={src} alt="Glitch" />;

function Logo() {
  const [hour, setHour] = useState(12);
  useEffect(() => {
    setHour(new Date().getHours());

    const handle = window.setInterval(() => {
      setHour(new Date().getHours());
    }, dayjs.convert(5, 'minutes', 'ms'));

    return () => window.clearInterval(handle);
  }, []);

  if (hour >= 16 && hour <= 18) return <LogoImage src={LOGO_SUNSET} />;
  if (hour > 18 || hour <= 8) return <LogoImage src={LOGO_NIGHT} />;
  return <LogoImage src={LOGO_DAY} />;
}

export default Logo;
