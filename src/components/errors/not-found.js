import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Text from 'Components/text/text';
import styles from './not-found.styl';

export const Aquarium = ({ className }) => (
  <svg className={classnames(styles.aquarium, className)} viewBox="0 0 88 86" xmlns="http://www.w3.org/2000/svg" aria-label="">
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <path
        d="M75.488 13.541C79.911 16.924 85.7 30.651 85.7 41.215c0 23.527-19.073 42.6-42.6 42.6S.5 64.742.5 41.215c0-9.341.835-14.852 5.894-21.888a119.629 119.629 0 0 1 4.27-5.542c4.146-.137 7.976.058 11.491.585 10.48 1.57 18.045 8.53 30.453 8.53 12.408 0 22.954-9.203 22.88-9.359z"
        fill="#617AEB"
        fillRule="nonzero"
      />
      <path
        d="M10.663 13.785c4.147-.137 6.104-.353 11.492.585 9.612 1.673 18.045 8.53 30.453 8.53 12.408 0 22.954-9.203 22.88-9.359"
        stroke="#000"
        strokeWidth="2"
        fillRule="nonzero"
      />
      <g transform="translate(.4 .3)" stroke="#000" strokeWidth="2">
        <rect x="11.25" width="62.7" height="6.3" rx="3.15" />
        <path
          d="M42.599 83.106c-14.047 0-26.558-7.034-34.067-17.538-.103-.144 68.134 0 68 .187-7.603 10.512-19.97 17.351-33.933 17.351z"
          fill="#FFF399"
          fillRule="nonzero"
        />
        <path d="M17.418 6.3h50.364C78.344 14.053 85.2 26.558 85.2 40.664c0 23.527-19.073 42.6-42.6 42.6S0 64.191 0 40.664C0 26.558 6.856 14.053 17.418 6.3z" />
      </g>
      <g transform="translate(20 68)" fill="#000" fillRule="nonzero" stroke="#000" strokeWidth=".938">
        <circle cx="1.163" cy="2.984" r="1" />
        <circle cx="10.851" cy="9.359" r="1" />
        <circle cx="14.601" cy="2.029" r="1" />
        <circle cx="20.601" cy="7.547" r="1" />
        <circle cx="28.802" cy="3.234" r="1" />
        <circle cx="37.851" cy="8.654" r="1" />
        <circle cx="44.601" cy="1.802" r="1" />
        <circle cx="28.324" cy="11.859" r="1" />
      </g>
      <path
        d="M54.203 65.408c-1.432-2.696-2.699-4.67-3.8-5.92-1.655-1.877-6.412-3.125-6.374-4.373.039-1.25.944-3.03 1.983-3.558 1.04-.526 2.595.834 4.116 1.89 1.52 1.056 3.474 3.303 4.104 2.4.63-.902.242-4.537-.282-5.955-.523-1.417-2.221-4.82-3.332-5.863-1.11-1.043-5.192-5.796-3.665-7.047 1.527-1.252.88-.797 2.086-1.356 1.206-.558 2.512.805 3.837 2.755 1.326 1.95 5.192-1.785 6.518-2.194.178-.055 1.17.357 1.595 1.13.371.675.607 1.48.357 1.96-.854 1.639-4.955 2.993-4.346 4.409.967 2.244 1.89 5.889 2.78 7.149.89 1.26 3.681.513 4.004-1.456.323-1.97.314-4.52.713-6.32.399-1.799.752-3.298 2.252-3.308.832-.006 2.285-.028 2.276 1.787-.008 1.814-.066 2.88-.213 3.56-.207.961 4.05.564 5.664 1.03.349.1 1.204 2.893-.236 3.3-1.54.435-6.057-.579-6.205-.127-.777 2.353-1.11 4.917-1.127 6.144-.011.828 1.266 1.47 2.573.89.629-.278 1.783-1.383 2.596-1.698 1.67-.647 2.56-.845 2.673-.593.939.947 1.401 1.92 1.388 2.923-.014 1.002-1.39 2.012-4.13 3.029a30.048 30.048 0 0 0-3.147 1.699c-.922.579-1.768 1.816-2.538 3.713h-12.12z"
        stroke="#000"
        strokeWidth="2"
        fill="#FF93B9"
        fillRule="nonzero"
      />
      <g transform="translate(15 19.5)" fill="#D3ECFF" fillRule="nonzero" stroke="#000" strokeWidth="2">
        <circle className={styles.bubble3} cx="2.899" cy="2.899" r="2.899" />
        <circle className={styles.bubble2} cx="14.672" cy="9.641" r="2.158" />
        <circle className={styles.bubble1} cx="5.798" cy="18.846" r="1.963" />
      </g>
      <g className="treasure-chest" transform="translate(12.5 45.2)" fillRule="nonzero" stroke="#000">
        <g className="treasure-chest-bottom" transform="translate(0 10.047)" strokeWidth="2">
          <path d="M2 0h17.927a2 2 0 0 1 2 2v8.047H0V2a2 2 0 0 1 2-2z" fill="#C454FF" />
          <path d="M4.42 10.047A4.42 4.42 0 0 0 0 5.627v4.42h4.42zm13.06 0a4.42 4.42 0 0 1 4.419-4.42v4.42h-4.42z" fill="#A2F6FF" />
          <path d="M8.064 0h5.799v2.228a2.9 2.9 0 1 1-5.799 0V0z" fill="#A2F6FF" />
        </g>
        <g className="treasure-chest-top" strokeWidth="2">
          <path d="M2.403 0h17.12a2 2 0 0 1 1.968 2.363l-1.419 7.684H1.855L.436 2.363A2 2 0 0 1 2.403 0z" fill="#C454FF" />
          <path d="M2.403 0h17.12a2 2 0 0 1 1.968 2.363l-.284 1.54-20.512-.14-.259-1.4A2 2 0 0 1 2.403 0z" fill="#A2F6FF" />
          <path d="M5.62 0h10.687a2 2 0 0 1 1.983 2.254l-.211 1.648L3.83 3.764l-.193-1.51A2 2 0 0 1 5.62 0z" fill="#C454FF" />
        </g>
        <g className="coins" transform="translate(3.127 5.795)" fill="#FFE100" strokeWidth="1.5">
          <path d="M9.95 3.162a3.162 3.162 0 1 0-6.325 0" />
          <path d="M11.548 3.51a2.536 2.536 0 0 0-4.923-.01" />
          <path d="M15.835 3.804a2.535 2.535 0 1 0-5.07 0" />
          <path d="M5.07 3.51a2.535 2.535 0 0 0-5.07 0" />
        </g>
      </g>
    </g>
  </svg>
);

const NotFound = ({ name }) => (
  <section>
    <Text>We didn't find {name}</Text>
    <div className={styles.errorImage}>
      <Aquarium />
    </div>
  </section>
);

NotFound.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NotFound;
