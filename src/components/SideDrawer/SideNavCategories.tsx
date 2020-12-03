import React from 'react';
import { Link } from 'react-router-dom';
import { createCategoryUrl } from '../../routes';
import * as moltin from '@moltin/sdk';
import { useCategories } from '../../app-state';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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
  }),
);

export const SideNavCategories: React.FC = (props) => {
  const { categoriesTree } = useCategories();
  const classes = useStyles();

  function renderCategories(categories: moltin.Category[]): React.ReactElement {
    return (
      <List component="div" disablePadding>

        {categories?.map(category => (
            <><div>{category.name}</div>
            <ListItem button component={Link} to={createCategoryUrl(category.slug)} className={classes.nested}>
              <ListItemText primary={category.children && renderCategories(category.children)} />
            </ListItem></>
        ))}
      </List>
    );
  }

  return (
    <div>
      {categoriesTree && renderCategories(categoriesTree)}
    </div>
  );
};
