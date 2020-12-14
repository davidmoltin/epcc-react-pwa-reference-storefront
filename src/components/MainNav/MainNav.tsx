import React, { useState }  from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import * as moltin from '@moltin/sdk';
import { useTranslation } from '../../app-state';
import { useCategories } from '../../app-state';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import './MainNav.scss';
import { MainHierarchy } from './MainHierarchy';
import { ReactComponent as CloseIcon } from '../../images/icons/ic_close.svg';
import { Button, ButtonGroup } from '@material-ui/core'
import ExpandMoreOutlined from '@material-ui/icons/ExpandMoreOutlined'

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
      paddingRight: "25px",
      paddingLeft: "25px",
      fontWeight: 700,
    },
  }),
);

export const MainNav: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { categoriesTree } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [categoryHistory, setCategoryHistory] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setCategoryHistory([...categoryHistory, categoryId]);
    setCategoryName(categoryName);
  };

  const handleCloseNavigation = () => {
    setIsTopMenuOpen(!isTopMenuOpen);
    setIsOpen(false);
    setCategoryName(t('categories'));
  };

  const handleSelectorClicked = (category: string) => {
    setIsOpen(!isOpen);
    setCategoryHistory([]);
    setCategoryName(category);
  };

  const handleBack = () => {
    if (categoryHistory.length !== 0) {
      const updatedCategoryHistory: string[] = categoryHistory.slice(categoryHistory.length, 1);
      setCategoryName(t('products'));
      setCategoryHistory(updatedCategoryHistory);
    } else {
      setIsOpen(false);
      setCategoryName(t('categories'));
    }
  };

  const reference = useOnclickOutside(() => {
    setIsOpen(false);
  });
  
  function renderTopCategories(categories: moltin.Category[]): React.ReactElement {
    const topCategories = [
      { name: 'home', displayName: t('home'), url: '/' },
      { name: 'products', displayName: t('products'), children: categories },
    ];

    return (
       //Start Mobile Menu
      <div className="navigation__categories">
        <div className="navigation__categories --header" ref={reference}>
          <button onClick={handleBack} className="navigation__categories --leftarrow">
            {t('back')}
          </button>
          <span className="navigation__title">
            {categoryName}
          </span>
          <CloseIcon onClick={handleCloseNavigation} className="navigation__categories --close" />
        </div>
       <ButtonGroup>
         {topCategories?.map(category => (
           <div key={category.name}>
             {category.url ? ( 
                <Button href={category.url} className={classes.navbutton} color="inherit">{category.displayName}</Button>
             ) : (
                <Button endIcon={ <ExpandMoreOutlined style={{fontSize: "1.2rem"}}/> } ref={reference} onClick={() => handleSelectorClicked(category.displayName)} className={classes.navbutton} color="inherit">{category.displayName}</Button>
             )}
           </div>
         ))}
       </ButtonGroup>
       { /**category menu starts here**/ }
       <div ref={reference} className={`navigation__dropdowncontent ${isOpen ? '--show' : ''}`}>
         <MainHierarchy categoryHistory={categoryHistory} handleCloseNavigation={handleCloseNavigation} handleCategoryClick={handleCategoryClick} />
       </div>
     </div>
   );
 }

  return (

        <div>
          {categoriesTree && renderTopCategories(categoriesTree)}
        </div>

  );
};
