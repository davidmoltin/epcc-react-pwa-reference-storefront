import React from 'react';
import { Link } from 'react-router-dom'
import * as moltin from '@moltin/sdk';
import { useTranslation } from '../../app-state';
import { useCategories } from '../../app-state';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { SideNavCategories } from './SideNavCategories';
import { List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
        fontSize: "1rem",
    },
  }),
);


export default function SideMenu() {
  const { t } = useTranslation();

  const classes = useStyles();
  const { categoriesTree } = useCategories();

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  function renderTopCategories(categories: moltin.Category[]): React.ReactElement {
    const topCategories = [
      { name: 'home', displayName: t('home'), url: '/' },
      { name: 'products', displayName: t('products'), children: categories },
      { name: 'support', displayName: t('support'), url:'/contactus' },
    ];

    return (
       //Start Mobile Menu
       <div>
       <List>
         {topCategories?.map(category => (
           <div key={category.name}>
             {category.url ? (
                <ListItem button component={ Link } to={category.url} className={classes.navbutton} color="secondary">
                  <ListItemText primary={category.displayName} />
                </ListItem>
             ) : (
                <>{ /**category menu starts here**/ }
                  <ListItem button onClick={handleClick}>
                    <ListItemText primary={category.displayName} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open} timeout="auto">
                       <SideNavCategories />
                  </Collapse>
                   </>
             )}
           </div>
         ))}
      </List>
          </div>
   );
 }

  return (
        <div>
          {categoriesTree && renderTopCategories(categoriesTree)}
        </div>
  );
};
