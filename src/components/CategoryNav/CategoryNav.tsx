import React, { useState }  from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import * as moltin from '@moltin/sdk';
import { useTranslation } from '../../app-state';
import { useCategories } from '../../app-state';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import './CategoryNav.scss';
import { CategoryHierarchy } from './CategoryHierarchy';
import { Button, ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    navbutton: {
        margin: theme.spacing(1),
        paddingRight: "25px",
        paddingLeft: "25px",
        fontSize: ".9rem",
        width: "230px",
        //textTransform: "none",
    },
  }),
);

export const CategoryNav: React.FC = () => {
  const { t } = useTranslation();

  const classes = useStyles();
  const { categoriesTree } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [categoryHistory, setCategoryHistory] = useState<string[]>([]);
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setCategoryHistory([...categoryHistory, categoryId]);
  };

  const handleCloseNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
    setIsOpen(false);
  };

  const handleSelectorClicked = (category: string) => {
    setIsOpen(!isOpen);
    setCategoryHistory([]);
  };

  function renderTopCategories(categories: moltin.Category[]): React.ReactElement {
    const topCategories = [
      { name: 'home', displayName: t('home'), url: '/' },
      { name: 'products', displayName: t('products'), children: categories },
    ];

    return (
    <div>
      <ButtonGroup>
        {topCategories?.map(category => (
          <div key={category.name}>
            {category.url ? ( 
                <Button href={category.url} className={classes.navbutton} color="secondary">{category.displayName}</Button>
            ) : (
              <CategoryHierarchy categoryHistory={categoryHistory} handleCloseNavigation={handleCloseNavigation} handleCategoryClick={handleCategoryClick} />
            )}
          </div>
        ))}
      </ButtonGroup>
    </div>
   );
 }

  return (
        <div>
          {categoriesTree && renderTopCategories(categoriesTree)}
        </div>
  );
};
