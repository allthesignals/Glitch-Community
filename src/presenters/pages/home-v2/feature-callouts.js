import React from 'react';
import classnames from 'classnames';

import styles from './animations.styl';

export const Discover = () => (
  <svg version="1.1" viewBox="0 0 255 125" className={styles.feature} aria-label="">
    <defs>
      <ellipse cx="16.79" cy="14.95" rx="16.79" ry="7.80" />
      <path d="M 23.26,19.31 C 28.45,11.62 29.76,3.43 26.19,1.02 22.62,-1.38 15.52,2.90 10.33,10.59 5.14,18.28 3.83,26.47 7.40,28.88 10.97,31.29 18.07,27.00 23.26,19.31 Z" />
      <path d="M 23.48,10.93 C 18.70,2.98 11.83,-1.66 8.14,0.55 4.45,2.77 5.33,11.01 10.11,18.97 14.89,26.92 21.76,31.57 25.45,29.35 29.14,27.13 28.26,18.88 23.48,10.93 Z" />
      <path d="M 38.10,12.80 C 39.32,14.80 40,17.03 40,19.39 c 0,8.56 -8.95,15.5 -20,15.5 -11.04,0 -20,-6.93 -20,-15.5 0,-2.07 0.52,-4.06 1.48,-5.87 L 0.80,3.80 C 0.71,2.42 1.74,1.22 3.12,1.13 3.56,1.10 4.00,1.18 4.39,1.37 l 7.72,3.76 C 14.53,4.34 17.20,3.89 20,3.89 c 2.27,0 4.45,0.29 6.49,0.83 l 8.71,-4.24 c 0.39,-0.19 0.83,-0.27 1.27,-0.24 1.37,0.09 2.41,1.29 2.31,2.66 z" />
    </defs>
    <g style={{ fill: 'none', fillRule: 'evenodd', stroke: 'none', strokeWidth: '1' }}>
      <g className={classnames(styles.animation, styles.react)} style={{ fillRule: 'nonzero' }}>
        <circle cx="48.5" cy="27.83" r="3.59" style={{ fill: '#61dafb', stroke: '#000000', strokeWidth: '1.69' }} />
        <ellipse strokeLinejoin="square" cx="47.74" cy="28.01" rx="15.9" ry="6.90" style={{ stroke: '#61dafb', strokeWidth: '2.54' }} />
        <ellipse
          cx="48"
          cy="27.83"
          rx="17.79"
          ry="8.80"
          style={{ stroke: '#000000', strokeWidth: '2.5', strokeMiterlimit: '4', strokeDasharray: 'none' }}
        />
        <path
          d="m 54.02,31.65 c 4.94,-7.32 6.17,-15.01 3.17,-17.04 -3.00,-2.02 -9.66,1.99 -14.61,9.32 -4.94,7.32 -6.17,15.01 -3.17,17.04 3.00,2.02 9.66,-1.99 14.61,-9.32 0,0 0,0 0,0"
          strokeLinejoin="square"
          style={{ stroke: '#61dafb', strokeWidth: '1.79' }}
        />
        <path
          d="M 55.59,32.71 C 50.13,40.80 42.54,45.38 38.34,42.55 34.14,39.71 35.54,30.96 41.00,22.87 46.46,14.77 54.05,10.20 58.25,13.03 c 4.20,2.83 2.80,11.58 -2.65,19.67 0,0 0,0 0,0"
          style={{ stroke: '#000000', strokeWidth: '2' }}
        />
        <path
          d="M 54.21,24.23 C 49.66,16.66 43.21,12.29 40.11,14.16 c -3.10,1.86 -2.27,9.60 2.27,17.18 4.55,7.57 10.99,11.94 14.10,10.07 3.10,-1.86 2.27,-9.60 -2.27,-17.18 0,0 0,0 0,0"
          strokeLinejoin="square"
          style={{ stroke: '#61dafb', strokeWidth: '1.79' }}
        />
        <path
          d="m 55.84,23.26 c 5.02,8.37 5.97,17.17 1.62,19.78 -4.34,2.61 -11.68,-2.35 -16.71,-10.72 -5.02,-8.37 -5.97,-17.17 -1.62,-19.78 4.34,-2.61 11.68,2.35 16.71,10.72 0,0 0,0 0,0"
          style={{ stroke: '#000000', strokeWidth: '2' }}
        />
      </g>
      <g style={{ stroke: '#000000', strokeWidth: '2.5' }}>
        <path
          d="m 92.23,26.99 c -3.17,0.27 -2.31,2.64 -2.29,2.69 1.06,2.66 3.08,7.75 4.16,10.40 0.20,0.50 0.41,1.01 0.61,1.51 -0.75,0.17 -1.47,0.48 -2.10,0.89 -1.77,1.16 -3.05,3.36 -2.26,5.49 0.01,0.02 0.02,0.04 0.03,0.06 0.00,0.02 0.00,0.04 0.01,0.06 1.86,4.20 8.40,2.45 9.84,-1.21 0.37,-0.94 -0.08,-3.59 -0.23,-3.96 -0.47,-1.17 -0.95,-2.34 -1.43,-3.52 -0.73,-1.80 -2.85,-5.99 -3.59,-7.79 -0.43,-0.88 1.44,-1.20 3.19,1.44 1.57,2.37 2.17,4.91 4.07,3.91 1.89,-1.00 0.69,-4.30 -1.92,-7.53 -2.62,-3.23 -6.34,-2.61 -8.10,-2.46 0,0 0,0 0,0"
          className={classnames(styles.animation, styles.note1)}
          style={{ fill: '#db96ff' }}
        />
        <path
          d="m 133.80,8.58 c 0,0 -6.22,-3.42 -6.22,-3.42 -0.65,-0.35 -1.29,-0.74 -1.95,-1.07 -0.59,-0.30 -1.26,-0.43 -1.93,-0.38 -1.06,-0.11 -2.09,0.43 -2.58,1.38 -1.45,2.60 -2.87,5.23 -4.30,7.84 0,0 -0.86,1.57 -0.86,1.57 -1.52,-1.17 -3.48,-1.61 -5.36,-1.20 -1.96,0.48 -3.26,2.35 -3.03,4.36 0.38,2.18 1.92,3.98 4.01,4.72 2.22,0.86 4.97,0.45 6.26,-1.72 0.07,-0.15 0.15,-0.32 0.21,-0.48 0.12,-0.16 0.23,-0.33 0.34,-0.52 0,0 1.91,-3.48 1.91,-3.48 0,0 3.09,-5.62 3.09,-5.62 0.60,0.33 1.22,0.64 1.77,0.94 0,0 4.84,2.66 4.84,2.66 -0.87,1.59 -1.74,3.18 -2.61,4.77 0,0 -0.86,1.57 -0.86,1.57 -1.53,-1.21 -3.53,-1.68 -5.45,-1.26 -1.96,0.48 -3.26,2.35 -3.03,4.36 0.38,2.18 1.92,3.98 4.01,4.72 2.22,0.86 4.97,0.45 6.26,-1.72 0.02,-0.04 0.04,-0.09 0.06,-0.14 0.22,-0.24 0.41,-0.50 0.56,-0.79 0,0 1.91,-3.48 1.91,-3.48 0,0 4.64,-8.45 4.64,-8.45 0.53,-0.76 0.71,-1.73 0.47,-2.63 -0.31,-1.11 -1.10,-2.03 -2.15,-2.51 0,0 0,0 0,0"
          className={classnames(styles.animation, styles.note2)}
          style={{ fill: '#fcf3b0' }}
        />
      </g>
      <g className={classnames(styles.animation, styles.tetris)}>
        <polygon
          points="15.28,81.33 25.63,81.42 25.54,91.68 15.19,91.59 "
          style={{
            fill: '#8958fb',
            stroke: '#222222',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeMiterlimit: '4',
            strokeDasharray: 'none',
          }}
        />
        <polygon
          points="15.19,91.59 25.54,91.68 25.45,101.94 15.10,101.85 "
          style={{
            fill: '#8958fb',
            stroke: '#222222',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeMiterlimit: '4',
            strokeDasharray: 'none',
          }}
        />
        <polygon
          points="15.37,71.07 25.72,71.16 25.63,81.42 15.28,81.33 "
          style={{
            fill: '#8958fb',
            stroke: '#222222',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeMiterlimit: '4',
            strokeDasharray: 'none',
          }}
        />
        <polygon
          points="25.63,81.42 35.98,81.51 35.89,91.77 25.54,91.68 "
          style={{
            fill: '#8958fb',
            stroke: '#222222',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeMiterlimit: '4',
            strokeDasharray: 'none',
          }}
        />
        <g>
          <rect x="17.70" y="73.19" width="5.40" height="5.44" rx="0.54" style={{ fill: '#ffffff' }} />
          <rect x="17.70" y="83.5" width="5.40" height="5.44" rx="0.54" style={{ fill: '#ffffff' }} />
          <rect x="17.70" y="93.90" width="5.40" height="5.44" rx="0.54" style={{ fill: '#ffffff' }} />
          <rect x="27.70" y="83.5" width="5.40" height="5.44" rx="0.54" style={{ fill: '#ffffff' }} />
        </g>
      </g>
      <g className={classnames(styles.cat, styles.animation)} style={{ fill: 'none', fillRule: 'evenodd', stroke: 'none', strokeWidth: '2' }}>
        <g style={{ fillRule: 'nonzero' }}>
          <path
            d="m 91.92,85.01 c 1.44,1.83 2.39,3.97 2.68,6.31 1.04,8.49 -6.99,16.47 -17.96,17.82 -10.96,1.34 -20.69,-4.45 -21.73,-12.94 -0.25,-2.06 0.02,-4.09 0.75,-6.01 0,0 -1.85,-9.56 -1.85,-9.56 -0.26,-1.35 0.62,-2.66 1.97,-2.93 0.43,-0.08 0.87,-0.05 1.29,0.09 0,0 8.12,2.79 8.12,2.79 2.30,-1.09 4.89,-1.86 7.67,-2.20 2.25,-0.27 4.46,-0.25 6.54,0.03 0,0 8.12,-5.27 8.12,-5.27 0.36,-0.23 0.79,-0.37 1.23,-0.39 1.37,-0.07 2.55,0.98 2.62,2.36 0,0 0.51,9.91 0.51,9.91"
            style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: '2.48' }}
          />
          <g style={{ fill: '#f8a5a5' }}>
            <path d="m 94.45,90.46 c -1.56,0.96 -3.35,1.61 -5.28,1.84 -7.21,0.88 -13.77,-4.24 -14.66,-11.45 -0.11,-0.92 -0.12,-1.83 -0.05,-2.72 1.69,-0.10 3.34,-0.03 4.93,0.18 0,0 8.12,-5.27 8.12,-5.27 0.36,-0.23 0.79,-0.37 1.23,-0.39 1.37,-0.07 2.55,0.98 2.62,2.36 0,0 0.51,9.91 0.51,9.91 1.29,1.63 2.18,3.50 2.56,5.55 0,0 0,0 0,0" />
          </g>
          <g style={{ stroke: '#000000', strokeWidth: '3.47' }}>
            <path
              d="m 74.56,95.51 c 0,0 -1.50,-1.62 -1.50,-1.62 -0.37,-0.40 -0.35,-1.03 0.05,-1.41 0.15,-0.14 0.34,-0.23 0.55,-0.25 0,0 2.56,-0.31 2.56,-0.31 0.54,-0.06 1.04,0.32 1.11,0.87 0.02,0.20 -0.01,0.42 -0.11,0.60 0,0 -1.06,1.93 -1.06,1.93 -0.26,0.48 -0.87,0.66 -1.35,0.39 -0.09,-0.05 -0.17,-0.11 -0.25,-0.19 0,0 0,0 0,0"
              style={{ strokeWidth: '2.5', strokeMiterlimit: '4', strokeDasharray: 'none' }}
            />
            <path
              d="m 75.52,96.65 c 0.10,2.17 -0.76,3.36 -2.60,3.59 -1.83,0.22 -3.05,-0.21 -3.64,-1.32"
              style={{ strokeWidth: '2.5', strokeLinecap: 'round', strokeMiterlimit: '4', strokeDasharray: 'none' }}
            />
            <path
              d="m 75.52,96.65 c 0.42,2.13 1.55,3.08 3.39,2.85 1.83,-0.22 2.90,-0.94 3.21,-2.17"
              style={{ strokeWidth: '2.5', strokeLinecap: 'round', strokeMiterlimit: '4', strokeDasharray: 'none' }}
            />
          </g>
          <g style={{ stroke: '#000000', strokeWidth: '3.47', strokeLinecap: 'round' }}>
            <path
              d="m 82.39,86.11 c 0,0 -2.70,2.18 -2.70,2.18 -0.21,0.17 -0.24,0.48 -0.07,0.70 0.04,0.05 0.10,0.10 0.16,0.13 0,0 3.18,1.60 3.18,1.60"
              style={{ strokeWidth: '2.5', strokeMiterlimit: '4', strokeDasharray: 'none' }}
            />
            <path
              d="m 65.26,88.39 c 0,0 3.15,1.46 3.15,1.46 0.25,0.11 0.35,0.41 0.24,0.66 -0.02,0.06 -0.07,0.12 -0.12,0.16 0,0 -2.70,2.32 -2.70,2.32"
              style={{ strokeWidth: '2.5', strokeMiterlimit: '4', strokeDasharray: 'none' }}
            />
          </g>
          <path
            d="m 91.92,85.01 c 1.44,1.83 2.39,3.97 2.68,6.31 1.04,8.49 -6.99,16.47 -17.96,17.82 -10.96,1.34 -20.69,-4.45 -21.73,-12.94 -0.25,-2.06 0.02,-4.09 0.75,-6.01 0,0 -1.85,-9.56 -1.85,-9.56 -0.26,-1.35 0.62,-2.66 1.97,-2.93 0.43,-0.08 0.87,-0.05 1.29,0.09 0,0 8.12,2.79 8.12,2.79 2.30,-1.09 4.89,-1.86 7.67,-2.20 2.25,-0.27 4.46,-0.25 6.54,0.03 0,0 8.12,-5.27 8.12,-5.27 0.36,-0.23 0.79,-0.37 1.23,-0.39 1.37,-0.07 2.55,0.98 2.62,2.36 0,0 0.51,9.91 0.51,9.91"
            style={{ stroke: '#000000', strokeWidth: '2.5', strokeMiterlimit: '4', strokeDasharray: 'none' }}
          />
        </g>
      </g>
      <g transform="translate(142.59,23.94)" style={{ stroke: '#000000', strokeWidth: '2.5' }}>
        <rect x="11.19" y="0" width="96.30" height="72.03" rx="4.5" style={{ fill: '#77ffc8' }} />
        <path
          d="m 15.59,0.22 h 87.49 c 2.48,0 4.5,2.01 4.5,4.49 V 13.05 H 11.09 V 4.72 c 0,-2.48 2.01,-4.49 4.5,-4.49 z"
          style={{ fill: '#ffffff' }}
        />
        <path d="M 4.88,10.22 H 92.38 c 2.48,0 4.5,2.01 4.5,4.5 v 8.32 H 0.38 v -8.32 c 0,-2.48 2.01,-4.5 4.50,-4.5 z" style={{ fill: '#eaeaea' }} />
      </g>
      <g transform="translate(142.46,33.80)" style={{ stroke: '#000000', strokeWidth: '2.5' }}>
        <rect x="0.51" y="0.37" width="96.30" height="72.03" rx="5.84" style={{ fill: '#ff9696' }} />
        <path
          d="M 5.01,0.37 H 92.51 c 2.48,0 4.5,2.01 4.5,4.50 V 13.19 H 0.51 V 4.87 c 0,-2.48 2.01,-4.50 4.49,-4.50 z"
          style={{ fill: '#ffffff' }}
        />
      </g>
      <g transform="translate(129.08,54.90)">
        <path d="M 0.41,0.37 H 96.41 V 55.17 c 0,2.48 -2.01,4.5 -4.5,4.5 H 4.91 c -2.48,0 -4.50,-2.01 -4.50,-4.5 z" style={{ fill: '#bfb5ff' }} />
        <g transform="translate(27.20,10.37)" style={{ fillRule: 'nonzero', stroke: '#000000' }}>
          <g transform="rotate(-1,87.35,-54.60)">
            <g transform="translate(0.24,0.06)">
              <polygon
                transform="rotate(-15,19.15,17.57)"
                points="35.10,11.67 19.22,31.34 3.20,11.67 9.45,3.80 29.53,3.80 "
                style={{ fill: '#fcf3b0', strokeWidth: '2' }}
              />
              <polygon
                transform="rotate(-15,16.74,8.29)"
                points="16.43,4.57 24.00,12.00 9.48,12.00 "
                style={{ fill: '#ffffff', strokeWidth: '1.25' }}
              />
              <polygon
                transform="rotate(19,28.37,7.08)"
                points="25.87,11.03 32.59,6.82 24.16,3.12 "
                style={{ fill: '#ffffff', strokeWidth: '1.25' }}
              />
              <polygon
                transform="rotate(19,7.61,12.51)"
                points="3.90,16.96 11.33,12.38 4.64,8.07 "
                style={{ fill: '#ffffff', strokeWidth: '1.25' }}
              />
              <polygon
                transform="rotate(19,18.18,18.53)"
                points="21.58,8.34 26.41,28.73 9.95,16.26 "
                style={{ fill: '#ffffff', strokeWidth: '1.25' }}
              />
            </g>
            <path d="m 1.92,11.94 h 32.03" transform="rotate(-15,17.93,11.94)" style={{ strokeWidth: '1.25' }} />
            <path d="M 19.60,32.40 9.82,5.11" transform="rotate(-15,14.71,18.76)" style={{ strokeWidth: '1.25' }} />
            <polyline transform="rotate(-15,24.40,16.29)" points="19.21 30.06 26.74 10.10 29.59 2.52" style={{ strokeWidth: '1.25' }} />
          </g>
        </g>
        <rect x="0.05" y="-12" width="96.30" height="72.03" rx="4.5" style={{ stroke: '#000000', strokeWidth: '2.5' }} />
        <path
          d="M 4.70,-12 H 91.70 c 2.48,0 4.5,2.01 4.5,4.5 V 0.82 H 0.20 V -7.5 c 0,-2.48 2.01,-4.5 4.49,-4.5 z"
          style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: '2.5' }}
        />
        <polygon
          points="66.46,42.51 85.10,52.41 81.25,56.00 88.45,64.08 84.34,67.78 77.15,59.85 73.28,63.47 "
          style={{
            fill: '#ffffff',
            fillRule: 'nonzero',
            stroke: '#222222',
            strokeWidth: '2.64',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        />
      </g>
      <path style={{ strokeWidth: '1.25' }} d="M18.52,86.67L48.5,27.83L110.14,34.17L201.93,109.17L86.44,97.98" />
    </g>
  </svg>
);

export const Dreams = () => (
  <svg viewBox="0 0 184 119" className={styles.feature} aria-label="">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-535.00, -620.00)">
        <g transform="translate(489.00, 605.26)">
          <g transform="translate(27.89, 0.00)">
            <g transform="translate(19.86, 17.00)">
              <path
                d="M35.19,65.69 C38.17,63.78 41.51,57.83 45.23,47.86 C50.81,32.90 49.78,15.96 42.90,15.96 C36.02,15.96 34.36,19.92 35.19,26.65 C36.02,33.38 57.22,55.83 68.39,45.47 C79.55,35.11 81.71,9.38 100.73,1.51 C113.41,-3.73 126.14,4.64 138.93,26.65"
                className={classnames(styles.animation, styles.animationPath)}
                stroke="#FFFFFF"
                strokeWidth="3.5"
                fillRule="nonzero"
              />
              <g transform="translate(0.00, 50.84)">
                <g fillRule="nonzero">
                  <g stroke="#000000" strokeWidth="2.5">
                    <g>
                      <path
                        d="M4.85,16.80 C4.52,12.33 5.90,9.11 8.99,7.12 C12.09,5.14 15.03,5.00 17.81,6.72 C21.34,2.24 25.08,0 29.01,0 C32.95,0 36.41,1.57 39.41,4.71 C44.59,2.79 48.68,2.79 51.66,4.71 C54.64,6.64 56.01,9.95 55.76,14.66 C60.83,16.21 63.33,18.78 63.27,22.37 C63.20,25.95 61.63,27.96 58.53,28.40 C59.38,29.74 59.80,32.13 59.80,35.55 C59.80,40.68 53.20,51.00 43.28,51.00 C33.36,51.00 28.22,45.97 26.96,44.83 C25.71,43.69 15.78,44.17 10.48,41.75 C5.18,39.34 0.20,33.69 0.40,26.93 C0.54,22.42 2.02,19.04 4.85,16.80 Z"
                        fill="#FFDADF"
                      />
                      <path d="M4.35,17.34 C6.45,15.45 8.99,15.00 11.97,15.96" strokeLinecap="round" />
                    </g>
                    <path d="M39.41,4.71 C35.18,7.32 33.07,9.94 33.07,12.58" strokeLinecap="round" />
                    <path d="M58.08,27.89 C55.86,25.19 52.61,24.20 48.32,24.92" strokeLinecap="round" />
                    <path d="M27.32,44.83 C25.80,43.08 25.54,40.57 26.53,37.29" strokeLinecap="round" />
                  </g>
                  <g opacity="0.33" transform="translate(4.35, 7.12)" fill="#D26E7B">
                    <circle cx="9.10" cy="8.72" r="1.48" />
                    <circle cx="16.14" cy="5.42" r="1.48" />
                    <circle cx="6.13" cy="18.28" r="1.48" />
                    <circle cx="1.48" cy="25.21" r="1.48" />
                    <circle cx="9.10" cy="29.57" r="1.48" />
                    <circle cx="18.12" cy="25.21" r="1.48" />
                    <circle cx="16.14" cy="16.79" r="1.48" />
                    <circle cx="22.86" cy="1.48" r="1.48" />
                    <circle cx="34.75" cy="6.60" r="1.48" />
                    <circle cx="42.49" cy="2.97" r="1.48" />
                    <circle cx="45.44" cy="11.35" r="1.48" />
                    <circle cx="45.44" cy="11.35" r="1.48" />
                    <circle cx="46.93" cy="25.10" r="1.48" />
                    <circle cx="48.42" cy="31.75" r="1.48" />
                    <circle cx="37.33" cy="36.97" r="1.48" />
                    <circle cx="31.77" cy="31.06" r="1.48" />
                    <circle cx="37.33" cy="19.76" r="1.48" />
                    <circle cx="43.96" cy="37.70" r="1.48" />
                    <circle cx="24.45" cy="33.13" r="1.48" />
                    <circle cx="53.36" cy="15.71" r="1.48" />
                  </g>
                </g>
                <g transform="translate(15.44, 11.79)">
                  <g>
                    <circle fill="#FFFFFF" cx="7.52" cy="8.15" r="6.25" />
                    <g transform="translate(0.07, 0.71)" fill="#222222" fillRule="nonzero">
                      <path d="M7.44,14.89 C3.32,14.89 0,11.56 0,7.44 C0,3.32 3.32,0 7.44,0 C11.56,0 14.89,3.32 14.89,7.44 C14.89,11.56 11.48,14.89 7.44,14.89 Z M7.44,2.37 C4.67,2.37 2.37,4.67 2.37,7.44 C2.37,10.21 4.67,12.51 7.44,12.51 C10.21,12.51 12.51,10.21 12.51,7.44 C12.51,4.67 10.21,2.37 7.44,2.37 Z" />
                      <path d="M9.26,13.80 C7.28,13.80 5.70,12.05 5.70,9.84 C5.70,7.62 7.28,5.87 9.26,5.87 C11.24,5.87 12.83,7.62 12.83,9.84 C12.83,12.05 11.16,13.80 9.26,13.80 Z" />
                    </g>
                  </g>
                  <g transform="translate(15.84, 6.42)">
                    <g>
                      <circle fill="#FFFFFF" cx="7.52" cy="8.15" r="6.25" />
                      <path
                        d="M7.52,15.60 C3.40,15.60 0.07,12.27 0.07,8.15 C0.07,4.03 3.40,0.71 7.52,0.71 C11.64,0.71 14.97,4.03 14.97,8.15 C14.97,12.27 11.56,15.60 7.52,15.60 Z M7.52,3.08 C4.75,3.08 2.45,5.38 2.45,8.15 C2.45,10.93 4.75,13.22 7.52,13.22 C10.29,13.22 12.59,10.93 12.59,8.15 C12.59,5.38 10.29,3.08 7.52,3.08 Z"
                        fill="#222222"
                        fillRule="nonzero"
                      />
                    </g>
                    <path
                      d="M9.34,14.51 C7.36,14.51 5.78,12.77 5.78,10.55 C5.78,8.33 7.36,6.59 9.34,6.59 C11.32,6.59 12.91,8.33 12.91,10.55 C12.91,12.77 11.24,14.51 9.34,14.51 Z"
                      fill="#222222"
                      fillRule="nonzero"
                    />
                  </g>
                </g>
              </g>
              <g transform="translate(105.09, 25.02)" stroke="#000000">
                <g>
                  <rect strokeWidth="2.5" fill="#F692AB" x="5.94" y="65.34" width="63.31" height="24.40" rx="6.25" />
                  <rect strokeWidth="2.5" fill="#F692AB" x="0" y="0" width="75.53" height="69.85" rx="6.25" />
                  <rect strokeWidth="2.5" fill="#000000" x="5.94" y="7.52" width="63.31" height="51.06" rx="5" />
                  <path d="M17.82,78.71 L43.45,78.71" strokeWidth="3.12" fill="#939598" />
                  <circle strokeWidth="2" fill="#2BD451" cx="53.33" cy="79.07" r="3.83" />
                </g>
                <g className={classnames(styles.animation, styles.browser)} transform="translate(5.94, 7.52)" strokeWidth="2.5">
                  <rect fill="#A2D7FF" x="0" y="0" width="63.31" height="51.06" rx="5" />
                  <path d="M5,0 L58.31,0 C61.07,0 63.31,2.23 63.31,5 L63.31,9.5 L0,9.5 L0,5 C0,2.23 2.23,0 5,0 Z" fill="#FFFFFF" />
                </g>
                <g className={classnames(styles.animation, styles.sparkles)} transform="translate(19.25, 22.25)" strokeWidth="2">
                  <path
                    d="M8.41,9.36 C6.28,11.49 0.62,12.06 0.62,12.36 L0.62,12.36 C0.62,12.65 6.24,13.86 8.41,16.04 L8.41,16.04 C10.59,18.21 11.96,24.10 12.36,24.10 L12.36,24.10 C12.77,24.10 13.26,18.04 15.26,16.04 L15.26,16.04 C17.26,14.04 24.11,12.68 24.11,12.36 L24.11,12.36 C24.11,12.03 17.05,11.16 15.26,9.36 L15.26,9.36 C13.46,7.56 12.70,0.61 12.36,0.61 L12.36,0.61 C12.03,0.61 10.54,7.23 8.41,9.36"
                    fill="#FFEA4E"
                  />
                  <path
                    d="M31.96,21.12 L28.59,15.91 C28.44,15.68 28.50,15.37 28.73,15.22 C28.88,15.13 29.07,15.12 29.23,15.19 L38.50,19.75 C38.75,19.87 38.85,20.17 38.73,20.42 C38.71,20.46 38.68,20.50 38.65,20.53 L31.37,28.56 C31.18,28.77 30.86,28.78 30.66,28.60 C30.53,28.48 30.47,28.30 30.51,28.12 L31.96,21.12 Z"
                    fill="#83FFCD"
                    fillRule="nonzero"
                    transform="translate(33.35, 22.16) rotate(33.00) translate(-33.35, -22.16) "
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const Teams = () => (
  <svg viewBox="0 0 194 115" className={styles.feature} aria-label="">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-517.00, -627.00)">
        <g transform="translate(518.85, 628.30)">
          <g transform="translate(63.11, 5.55)">
            <path
              d="M68.78,12.99 L126.49,12.99 L126.49,89.14 C126.49,92.37 123.87,94.99 120.64,94.99 L68.78,94.99 L68.78,12.99 Z"
              fill="#EAEAEA"
              fillRule="nonzero"
            />
            <g transform="translate(0.00, 12.99)" fillRule="nonzero">
              <path d="M0,0 L70.53,0 L70.53,81.99 L4.5,81.99 C2.01,81.99 0,79.98 0,77.49 L0,0 Z" fill="#484848" />
              <g transform="translate(8.06, 65.65)" stroke="#FFCD00" strokeLinecap="round" strokeWidth="3.75">
                <path d="M1.21,0.49 L32.92,0.49" className={classnames(styles.animation, styles.user3Line1)} />
              </g>
              <g transform="translate(10.12, 43.87)" stroke="#83FFCD" strokeLinecap="round" strokeWidth="3.75">
                <path d="M11.47,8.99 L43.18,8.99" className={classnames(styles.animation, styles.user2Line2)} />
                <path d="M0.86,0.49 L33.99,0.49" className={classnames(styles.animation, styles.user2Line1)} />
              </g>
              <g
                className={classnames(styles.animation, styles.user1Lines)}
                transform="translate(10.12, 10.49)"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeWidth="3"
              >
                <path d="M6.77,19.43 L24.96,19.43" />
                <path d="M6.77,9.96 L24.96,9.96" />
                <path d="M0.49,0.49 L19.63,0.49" />
              </g>
            </g>
            <rect
              className={classnames(styles.animation, styles.user1Shape)}
              stroke="#626262"
              strokeWidth="3.50"
              fill="#FFFFFF"
              fillRule="nonzero"
              x="80.58"
              y="33.09"
              width="14.49"
              height="14.49"
              rx="7.01"
            />
            <rect
              className={classnames(styles.animation, styles.user2Shape)}
              stroke="#626262"
              strokeWidth="3.50"
              fill="#83FFCD"
              fillRule="nonzero"
              x="89.58"
              y="38.28"
              width="26.48"
              height="26.48"
              rx="7.01"
            />
            <path
              d="M101.04,38.28 L94.85,38.28 C91.94,38.28 89.58,40.64 89.58,43.54 L89.58,54.86 L95.77,54.86 C98.68,54.86 101.04,52.51 101.04,49.60 L101.04,38.28 Z"
              className={classnames(styles.animation, styles.user3Shape)}
              stroke="#626262"
              strokeWidth="3.50"
              fill="#FFCD00"
              fillRule="nonzero"
            />
            <rect stroke="#000000" strokeWidth="2.5" x="0" y="0" width="126.99" height="94.99" rx="5.84" />
            <path
              d="M4.5,0 L122.49,0 C124.97,0 126.99,2.01 126.99,4.5 L126.99,12.82 L0,12.82 L0,4.5 C0,2.01 2.01,0 4.5,0 Z"
              stroke="#000000"
              strokeWidth="2.5"
              fill="#EAEAEA"
            />
          </g>
          <g transform="translate(5.98, 0.00)" fillRule="nonzero">
            <circle stroke="#000000" strokeWidth="2.5" fill="#FFFFFF" cx="15.13" cy="15.13" r="15.13" />
            <g transform="translate(6.67, 10.90)" fill="#222222">
              <ellipse cx="2.29" cy="2.29" rx="2.12" ry="2.16" />
              <ellipse cx="14.63" cy="2.29" rx="2.12" ry="2.16" />
              <path d="M4.79,7.09 C5.00,7.27 5.33,7.50 5.78,7.72 C7.56,8.60 9.63,8.60 11.75,7.17 C12.24,6.83 12.37,6.15 12.04,5.65 C11.71,5.14 11.05,5.01 10.55,5.34 C9.13,6.31 7.85,6.31 6.72,5.75 C6.45,5.61 6.27,5.49 6.19,5.42 C5.74,5.03 5.06,5.08 4.68,5.54 C4.29,6.00 4.34,6.69 4.79,7.09 Z" />
            </g>
          </g>
          <g className={classnames(styles.animation, styles.user2)} transform="translate(21.37, 40.61)" fillRule="nonzero">
            <circle stroke="#000000" strokeWidth="2.5" fill="#B5FFE1" cx="15.13" cy="15.13" r="15.13" />
            <g transform="translate(6.16, 10.65)" fill="#222222">
              <ellipse cx="2.29" cy="2.29" rx="2.12" ry="2.16" />
              <ellipse cx="14.63" cy="2.29" rx="2.12" ry="2.16" />
              <path d="M4.79,7.09 C5.00,7.27 5.33,7.50 5.78,7.72 C7.56,8.60 9.63,8.60 11.75,7.17 C12.24,6.83 12.37,6.15 12.04,5.65 C11.71,5.14 11.05,5.01 10.55,5.34 C9.13,6.31 7.85,6.31 6.72,5.75 C6.45,5.61 6.27,5.49 6.19,5.42 C5.74,5.03 5.06,5.08 4.68,5.54 C4.29,6.00 4.34,6.69 4.79,7.09 Z" />
            </g>
          </g>
          <g className={classnames(styles.animation, styles.user3)} transform="translate(0.00, 81.22)" fillRule="nonzero">
            <circle stroke="#000000" strokeWidth="2.5" fill="#FFCD00" cx="15.13" cy="15.13" r="15.13" />
            <g transform="translate(6.16, 10.65)" fill="#222222">
              <ellipse cx="2.29" cy="2.29" rx="2.12" ry="2.16" />
              <ellipse cx="14.63" cy="2.29" rx="2.12" ry="2.16" />
              <path d="M4.79,7.09 C5.00,7.27 5.33,7.50 5.78,7.72 C7.56,8.60 9.63,8.60 11.75,7.17 C12.24,6.83 12.37,6.15 12.04,5.65 C11.71,5.14 11.05,5.01 10.55,5.34 C9.13,6.31 7.85,6.31 6.72,5.75 C6.45,5.61 6.27,5.49 6.19,5.42 C5.74,5.03 5.06,5.08 4.68,5.54 C4.29,6.00 4.34,6.69 4.79,7.09 Z" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
