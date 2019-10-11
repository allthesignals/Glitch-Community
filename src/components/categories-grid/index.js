import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { find } from 'lodash';
import Link from 'Components/link';
import Image from 'Components/images/image';
import allCategories from 'Curated/categories';

import styles from './styles.styl';

const cx = classNames.bind(styles);

function CategoriesGrid({ categories, wrapItems, className }) {
  const categoriesToRender = useMemo(() => categories.map((category) => find(allCategories, (cat) => cat.url === category)), [categories]);

  const itemClassNames = cx({
    categoriesGridItem: true,
    wrapItems,
  });

  return (
    <ul className={classNames(styles.categoriesGrid, className)}>
      {categoriesToRender.map((category) => (
        <li key={category.url} className={itemClassNames} style={{ '--bg-color': category.color }}>
          <Link to={`/${category.url}`}>
            <Image src={category.icon} alt="" />
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

CategoriesGrid.propTypes = {
  categories: PropTypes.array,
  wrapItems: PropTypes.bool,
};

CategoriesGrid.defaultProps = {
  categories: allCategories,
  wrapItems: false,
};

export default CategoriesGrid;
