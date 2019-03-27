import React from 'react';
import PropTypes from 'prop-types';

const DefaultAvatar = ({ backgroundFillColor }) => (
  <svg width={159} height={147} viewBox="0 0 159 147">
    <g id="collection-avatar">
      <polygon id="frame" fill="#FFFB98" points="0 147 159 147 159 16 0 16" />
      <polygon id="sky" fill={backgroundFillColor} points="17 132 141 132 141 30 17 30" />
      <path d="M21,34 L21,128 L137,128 L137,34 L21,34 Z M17,30 L141,30 L141,132 L17,132 L17,30 Z" id="inner-frame" fill="#222222" />
      <path
        d="M68.3951106,15.06 L92.8773227,15.06 C91.7177318,9.99988 86.6693227,6.18 80.6362167,6.18 C74.6031106,6.18 69.5561712,9.99988 68.3951106,15.06 M95.3331864,19.5 L65.939247,19.5 C64.7208682,19.5 63.7347015,18.50692 63.7347015,17.28 C63.7347015,8.7108 71.3168682,1.74 80.6362167,1.74 C89.9555652,1.74 97.5377318,8.7108 97.5377318,17.28 C97.5377318,18.50692 96.5515652,19.5 95.3331864,19.5"
        id="handle"
        fill="#222222"
      />
      <g id="corners" transform="translate(0.000000, 16.000000)" fill="#222222">
        <polygon points="155.900868 130.683984 136.321565 114.551984 139.113989 111.115424 158.693292 127.247424" />
        <polygon points="140.496387 18 138 14.8389049 155.503613 0 158 3.16109514" />
        <polygon points="17.5036132 18 0 3.16109514 2.49638681 0 20 14.8389049" />
        <polygon points="2.74602549 131 0 127.487672 19.2539745 111 22 114.512328" />git 
      </g>
      <path
        d="M19.79,94.8593842 C44.8648958,101.507816 67.0872396,101.059896 86.4570312,93.515625 C98.7421875,87.9834818 108.882161,83.9138203 116.876953,81.3066406 C128.869141,77.395871 137.031484,77.3828125 138.51,78.2841797 C138.51,78.2841797 138.509596,95.4257813 138.508789,129.708984 L19.7919922,129.855469 L19.79,94.8593842 Z"
        id="grass"
        stroke="#222222"
        strokeWidth={4}
        fill="#05D458"
      />
      <circle id="sun" stroke="#000000" strokeWidth={4} fill="#E8DE1B" cx="40.8486328" cy="59.6357422" r="16" />
      <path
        d="M60.3348254,77.5704551 C58.9993547,80.6825277 55.8689424,82.8666205 52.2201169,82.8666205 C51.0942738,82.8666205 50.017785,82.6586888 49.0281483,82.2797234 C47.8967722,83.2670781 46.4079181,83.8666205 44.7767575,83.8666205 C41.2366977,83.8666205 38.3669121,81.042731 38.3669121,77.5592868 C38.3669121,74.362029 40.7845266,71.7204047 43.9190364,71.3079336 C44.4206293,69.9153121 45.2738944,68.6864115 46.3737706,67.7246127 C46.0662734,66.8112197 45.8994141,65.8316421 45.8994141,64.8125 C45.8994141,59.8419373 49.8685147,55.8125 54.7646484,55.8125 C58.4425588,55.8125 61.5973616,58.0862365 62.9395833,61.3246338 C63.8172067,61.0552858 64.7505289,60.9101562 65.7182989,60.9101562 C70.8661431,60.9101562 75.0392954,65.0165679 75.0392954,70.0820833 C75.0392954,75.1475988 70.8661431,79.2540104 65.7182989,79.2540104 C63.7128485,79.2540104 61.8553227,78.6307987 60.3348254,77.5704551 Z"
        stroke="#000000"
        strokeWidth={4}
        fill="#FFFFFF"
      />
      <path
        d="M121.554267,48.9330178 C121.561107,48.9330067 121.567948,48.9330011 121.57479,48.9330011 C128.315872,48.9330011 133.780598,54.3103309 133.780598,60.9436034 C133.780598,67.5768759 128.315872,72.9542057 121.57479,72.9542057 C118.736067,72.9542057 116.123683,72.0006337 114.050407,70.4012578 C112.497386,71.7531025 110.455645,72.5736517 108.21914,72.5736517 C103.3565,72.5736517 99.4145508,68.6947458 99.4145508,63.9098727 C99.4145508,62.7888762 99.6309116,61.7176053 100.024784,60.7342885 C98.6643533,59.5776974 97.8034355,57.8676186 97.8034355,55.9596774 C97.8034355,52.4762332 100.673221,49.6523438 104.213281,49.6523438 C104.670308,49.6523438 105.116163,49.69941 105.546114,49.7888854 C106.871499,46.5129316 110.045383,44.2060547 113.75,44.2060547 C117.122846,44.2060547 120.055763,46.1182434 121.554267,48.9330178 Z"
        stroke="#000000"
        strokeWidth={4}
        fill="#FFFFFF"
      />
      <path
        d="M82.3606089,42.5137208 C86.0065614,42.5895456 88.9384448,45.5215419 88.9384448,49.1273647 C88.9384448,52.7808104 85.928606,55.7425133 82.2157816,55.7425133 C79.6428183,55.7425133 77.4074568,54.3201849 76.2774254,52.2309783 C75.8404163,52.3576604 75.3778461,52.425639 74.8991407,52.425639 C72.2100723,52.425639 70.0301517,50.2805815 70.0301517,47.634519 C70.0301517,44.9884565 72.2100723,42.843399 74.8991407,42.843399 C75.2392876,42.843399 75.5712879,42.8777207 75.8917602,42.9430366 C76.3155392,41.4927371 77.63826,40.4348278 79.2043688,40.4348278 C80.6113173,40.4348278 81.8218341,41.2886374 82.3606089,42.5137208 Z"
        stroke="#000000"
        strokeWidth={4}
        fill="#FFFFFF"
      />
      <path d="M4.0,20 L4,143 L155,143 L155,20 L4,20 Z M0,16 L159,16 L159,147 L0,147 L0,16 Z" id="outer-frame" fill="#222222" />
    </g>
  </svg>
);

DefaultAvatar.propTypes = {
  backgroundFillColor: PropTypes.string,
};
DefaultAvatar.defaultProps = {
  backgroundFillColor: '#45C1F7',
};

export default DefaultAvatar;
