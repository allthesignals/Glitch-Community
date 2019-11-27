import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import OptimisticMarkdownInput from 'Components/fields/optimistic-markdown-input';

const AuthDescription = ({ authorized, description, placeholder, update, onBlur, allowImages }) => (
  authorized ? (
    <OptimisticMarkdownInput
      value={description}
      onChange={update}
      onBlur={onBlur}
      placeholder={placeholder}
      allowImages={allowImages}
    />
  ) : (
    description && (
      <div>
        <Markdown allowImages={allowImages}>{description}</Markdown>
      </div>
    )
  )
);

AuthDescription.propTypes = {
  allowImages: PropTypes.bool,
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func,
};

AuthDescription.defaultProps = {
  allowImages: true,
  placeholder: '',
  update: null,
};

export default AuthDescription;
