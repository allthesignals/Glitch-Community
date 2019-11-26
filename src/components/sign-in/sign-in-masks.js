import React from 'react';
import styles from './sign-in-masks.styl';

const PillsSrc = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fpills.svg?v=1574801487419';
const DotsSrc = 'https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fdots.svg?v=1574801487826';

const getRandomValue = (min, max) => {
  return Math.random() * (max - min) + min;
};

const randomPosition = (shapeType) => {
  let x; // the x coordinate the shape will randomly appear at
  let y;
  
  if (shapeType === 'dots') {
    // dots should stay on left side of screen
    x = getRandomValue(0, 40);
    y = getRandomValue(0, 50);
  } else {
    // dots should stay on right side of screen
    x = getRandomValue(60, 80);
    y = getRandomValue(50, 100);
  }
  return [x, y];
};

export const DotsImg = () => {
  const position = randomPosition('dots');
  const style = {
    left: `${position[0]}%`,
    top: `${position[1]}%`,
  };
  return <img src={DotsSrc} className={styles.dots} style={style} alt="" />;
};

export const PillsImg = () => {
  const position = randomPosition('pills');
  const style = {
    left: `${position[0]}%`,
    top: `${position[1]}%`,
  };
  return <img src={PillsSrc} className={styles.pills} style={style} alt="" />;
};
