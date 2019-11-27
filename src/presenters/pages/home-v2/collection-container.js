import React from 'react';
import classnames from 'classnames';

import { getUserAvatarStyle, getDisplayName } from 'Models/user';
import Link from 'Components/link';

import styles from './styles.styl';

const UserMask = ({ users, config }) => (
  <div className={styles.userMask} style={{ paddingBottom: `${(100 * config.height) / config.width}%` }}>
    {config.points.slice(0, users.length).map((point, i) => (
      <div
        key={users[i].id}
        className={styles.userMaskBubbleWrap}
        aria-label={getDisplayName(users[i])}
        style={{
          left: `${(100 * point.x) / config.width}%`,
          top: `${(100 * point.y) / config.height}%`,
          width: `${(100 * point.d) / config.width}%`,
        }}
      >
        <div className={styles.userMaskBubble} style={getUserAvatarStyle(users[i], 'small')} />
      </div>
    ))}
  </div>
);

const collectionStyles = {
  wavey: {
    color: '#87E0FF',
    texture: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fwavey.svg?v=1560090452140',
    width: 109,
    height: 153,
    points: [
      { x: 35, y: 0, d: 40 },
      { x: 77, y: 29, d: 32 },
      { x: 10, y: 40, d: 32 },
      { x: 42, y: 65, d: 32 },
      { x: 0, y: 86, d: 42 },
      { x: 49, y: 102, d: 51 },
    ],
  },
  diagonal: {
    color: '#FCF3B0',
    texture: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fdiagonal.svg?v=1560090452540',
    width: 116,
    height: 178,
    points: [
      { x: 0, y: 1, d: 40 },
      { x: 40, y: 41, d: 32 },
      { x: 84, y: 41, d: 32 },
      { x: 0, y: 85, d: 42 },
      { x: 52, y: 95, d: 32 },
      { x: 65, y: 127, d: 51 },
    ],
  },
  triangle: {
    color: '#FFB0B0',
    texture: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Ftriangle.svg?v=1560090452969',
    width: 102,
    height: 161,
    points: [
      { x: 2, y: 6, d: 40 },
      { x: 51, y: 1, d: 51 },
      { x: 17, y: 62, d: 42 },
      { x: 70, y: 71, d: 32 },
      { x: 0, y: 120, d: 30 },
      { x: 45, y: 129, d: 32 },
    ],
  },
};

const CuratedCollectionContainer = ({ collectionStyle, users, children, href }) => (
  <Link
    to={href}
    className={classnames(styles.curatedCollectionContainer, styles.plainLink)}
    style={{ backgroundColor: collectionStyles[collectionStyle].color }}
  >
    <img src={collectionStyles[collectionStyle].texture} alt="" className={styles.curatedCollectionTexture} />
    <div className={styles.curatedCollectionText}>{children}</div>
    <div className={styles.curatedCollectionUsers}>
      <UserMask config={collectionStyles[collectionStyle]} users={users} />
    </div>
  </Link>
);

export default CuratedCollectionContainer;
