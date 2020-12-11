import React from 'react';
import { createCategoryUrl } from '../../routes';
import * as moltin from '@moltin/sdk';
import { useCategories } from '../../app-state';

import './CategoryHierarchy.scss';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
        margin: theme.spacing(1),
        paddingRight: "25px",
        paddingLeft: "25px",
        fontSize: "1.05em",
        color: theme.palette.secondary.light,
        //textTransform: "none",
    },
  }),
);

interface CategoryHierarchyProps {
  categoryHistory: string[];
  handleCloseNavigation: () => void;
  handleCategoryClick: (id: string, name: string) => void;
}

export const CategoryHierarchy: React.FC<CategoryHierarchyProps> = (props) => {
  const { handleCloseNavigation } = props;
  const { categoriesTree } = useCategories();  
  const classes = useStyles();

  const handleCloseMenu = () => {
    handleCloseNavigation();
  };

  function renderCategories(categories: moltin.Category[], level: number = 0, isVisible: boolean = false): React.ReactElement {
    return (
      <div>
          <ul className={`catmenu__sub --level-${level} ${isVisible ? '--show' : ''}`}>
            {categories?.map(category => (
                <li key={category.id} className="catmenu__li">
                    <Button 
                    href={createCategoryUrl(category.slug)} 
                    onClick={handleCloseMenu}
                    fullWidth 
                    className={classes.button}
                    >
                      {category.name}
                    </Button>
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
