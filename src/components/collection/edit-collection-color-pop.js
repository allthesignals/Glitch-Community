import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { Actions, Button, Icon, Info, Popover } from '@fogcreek/shared-components';

import { isGoodColorContrast, pickRandomColor } from 'Utils/color';
import TextInput from 'Components/inputs/text-input';
import ColorInput from 'Components/inputs/color';

import styles from './edit-collection-color-pop.styl';
import { emoji } from '../global.styl';

const formatAndValidateHex = (hex) => {
  if (!hex) return null;
  hex = hex.trim();
  if (!hex.startsWith('#')) {
    hex = `#${hex}`;
  }
  // #ff00ff
  if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    return hex;
  }
  // #f0f
  if (/^#?[0-9A-Fa-f]{3}$/.test(hex)) {
    const [, r, g, b] = hex.split('');
    return ['#', r, r, g, g, b, b].join('');
  }
  return null;
};

function EditCollectionColorPop({ initialColor, updateColor, togglePopover }) {
  const [color, setColor] = useState(initialColor);
  const [hex, setHex] = useState(initialColor);
  const [error, setError] = useState(false);

  const changeColor = (value) => {
    setColor(value);
    setHex(value);
    updateColor(value);
  };

  const setRandomColor = () => {
    changeColor(pickRandomColor());
  };

  const onChangeColorPicker = useMemo(() => throttle(changeColor, 100), []);

  const onChangeHex = (value) => {
    setHex(value);

    const formatted = formatAndValidateHex(value);
    if (!formatted) {
      setError('Invalid Hex');
      return;
    }

    const hexIsGoodColorContrast = isGoodColorContrast(value);
    if (!hexIsGoodColorContrast) {
      setError('This color might make text hard to read. Try another!');
      return;
    }

    setColor(formatted);
    updateColor(formatted);
    setError(false);
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      togglePopover();
    } else {
      setError(false);
    }
  };

  return (
    <div className={styles.container}>
      <Info>
        <div className={styles.colorFormWrap}>
          <ColorInput value={color} onChange={onChangeColorPicker} />
          <div className={styles.hexWrap}>
            <TextInput
              autoFocus
              opaque
              value={hex}
              onChange={onChangeHex}
              onKeyPress={keyPress}
              placeholder="Hex"
              labelText="Custom color hex"
              error={error}
            />
          </div>
        </div>
      </Info>

      <Actions type="secondary">
        <Button size="small" variant="secondary" onClick={setRandomColor}>
          Random
          <Icon className={emoji} icon="bouquet" />
        </Button>
      </Actions>
    </div>
  );
}

const EditCollectionColor = ({ update, initialColor }) => (
  <Popover align="left" containerClass="edit-collection-color-btn" renderLabel={({ onClick, ref }) => <Button onClick={onClick} ref={ref}>Color</Button>}>
    {({ togglePopover }) => <EditCollectionColorPop updateColor={update} initialColor={initialColor} togglePopover={togglePopover} />}
  </Popover>
);

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};

export default EditCollectionColor;
