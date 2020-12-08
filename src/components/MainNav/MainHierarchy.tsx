import React from 'react';
import { Link } from 'react-router-dom';
import { createCategoryUrl } from '../../routes';
import * as moltin from '@moltin/sdk';
import { useCategories } from '../../app-state';

import './MainHierarchy.scss';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

interface MainHierarchyProps {
  categoryHistory: string[];
  handleCloseNavigation: () => void;
  handleCategoryClick: (id: string, name: string) => void;
}

export const MainHierarchy: React.FC<MainHierarchyProps> = (props) => {
  const { handleCloseNavigation } = props;
  const { categoriesTree } = useCategories();  
  const classes = useStyles();

  const handleCloseMenu = () => {
    handleCloseNavigation();
  };

  function renderCategories(categories: moltin.Category[], level: number = 0, isVisible: boolean = false): React.ReactElement {
    return (
      <div className={classes.root}>
      <ul className={`navmenu__sub --level-${level} ${isVisible ? '--show' : ''}`}>
       {categories?.map(category => (
           
          <li key={category.id} className="navmenu__li">
             <Link
                onClick={handleCloseMenu}
                to={createCategoryUrl(category.slug)}
              >
              <Button size="medium" fullWidth color="secondary" className={`navmenu__link ${category.children ? '--haschildren' : ''}`}>{category.name}</Button></Link>
            {category.children && renderCategories(category.children, level + 1)}
          </li>
        ))}
      </ul>
      </div>
    );
  }

  return (
    <div className="navmenu">
      {categoriesTree && renderCategories(categoriesTree)}
    </div>
  );
};
