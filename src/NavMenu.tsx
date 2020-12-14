import React from 'react';
import { createCategoryUrl } from './routes';
import * as moltin from '@moltin/sdk';
import { useCategories } from './app-state';
import { Button } from '@material-ui/core';

import './NavMenu.scss';

interface NavMenuProps {
  categoryHistory: string[];
  handleCloseNavigation: () => void;
  handleCategoryClick: (id: string, name: string) => void;
}

export const NavMenu: React.FC<NavMenuProps> = (props) => {
  const { handleCloseNavigation, categoryHistory, handleCategoryClick } = props;
  const { categoriesTree } = useCategories();

  const handleCloseMenu = () => {
    handleCloseNavigation();
  };

  const handleShow = (category: moltin.Category) => {
    handleCategoryClick(category.id, category.name);
  };

  function renderCategories(categories: moltin.Category[], level: number = 0, isVisible: boolean = false): React.ReactElement {
    return (
      <ul className={`navmenu__sub --level-${level} ${isVisible ? '--show' : ''}`}>
        {categories?.map(category => (
          <li key={category.id} className="navmenu__li">
              <Button href={createCategoryUrl(category.slug)} onClick={handleCloseMenu} size="medium" fullWidth color="secondary" className={`navmenu__link ${category.children ? '--haschildren' : ''}`}>{category.name}</Button>

              <button type="button" className={`navmenu__nextbutton ${category.children ? '--haschildren' : ''}`} onClick={() => handleShow(category)} />
            {category.children && renderCategories(category.children, level + 1, categoryHistory.includes(category.id))}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="navmenu">
      {categoriesTree && renderCategories(categoriesTree)}
    </div>
  );
};
