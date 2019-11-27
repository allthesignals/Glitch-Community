import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { range } from 'lodash';
import styles from './row.styl';

export const RowContainer = ({ as: Component = 'div', className, style, count, gap, minWidth, children }) => (
  <Component
    className={classnames(styles.row, className)}
    style={{
      ...style,
      '--item-count': count,
      '--gap': gap,
      '--min-width': minWidth,
    }}
  >
    {children}
  </Component>
);

export const RowItem = ({ as: Component = 'div', className, children, ...props }) => (
  <Component className={classnames(styles.item, className)} {...props}>
    {children}
  </Component>
);

const Row = ({ items, children, count, gap, minWidth, className, style }) => (
  <RowContainer as="ul" className={className} style={style} count={count} gap={gap} minWidth={minWidth}>
    {items.slice(0, count).map((item, index) => (
      <RowItem as="li" key={item.id}>
        {children(item, index)}
      </RowItem>
    ))}
    {count > items.length && range(0, count - items.length).map((i) => <li key={`filler-${i}`} className={styles.filler} />)}
  </RowContainer>
);

Row.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  count: PropTypes.number,
  gap: PropTypes.node,
  minWidth: PropTypes.node,
};

Row.defaultProps = {
  className: '',
  style: {},
  count: 3,
  gap: undefined,
  minWidth: undefined,
};

export default Row;
